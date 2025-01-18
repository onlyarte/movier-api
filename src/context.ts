import { FastifyRequest } from 'fastify';
import { PrismaClient, User } from '@prisma/client';

import TMDBService from './services/TMDB';
import UserService from './services/User';
import ListService from './services/List';
import RecommendationAIService from './services/RecommendationAI';
import config from './config';
import NoteService from './services/Note';
import StorageService from './services/Storage';

const prisma = new PrismaClient();
const tmdbService = new TMDBService(config.tmdbApiKey);
const userService = new UserService(prisma);
const recommendationAIService = new RecommendationAIService();
const noteService = new NoteService(prisma);
const storageService = new StorageService();

const listService = new ListService(
  prisma,
  tmdbService,
  recommendationAIService
);

const services = {
  tmdb: tmdbService,
  user: userService,
  list: listService,
  note: noteService,
  recommendationAI: recommendationAIService,
  storage: storageService,
};

export type GraphQLContext = {
  prisma: PrismaClient;
  services: {
    tmdb: TMDBService;
    user: UserService;
    list: ListService;
    note: NoteService;
    recommendationAI: RecommendationAIService;
    storage: StorageService;
  };
  currentUser: User | null;
  clientIp: string | null;
};

async function authenticateUser(request: FastifyRequest): Promise<User | null> {
  try {
    if (!request.headers.authorization) return null;

    const authInfo = await services.user.authInfo(
      request.headers.authorization.replace('Bearer ', '')
    );
    if (!authInfo) return null;

    const existingUser = await services.user.get(authInfo.sub);
    if (existingUser) return existingUser;

    const newUser = await services.user.create(authInfo);
    try {
      await services.list.createDefaults(newUser.id);
    } catch (error) {
      console.error(error);
    }
    return newUser;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function contextFactory(
  request: FastifyRequest
): Promise<GraphQLContext> {
  console.log(request.ip);
  return {
    prisma,
    services,
    currentUser: await authenticateUser(request),
    clientIp: request.ip,
  };
}
