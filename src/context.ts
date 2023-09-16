import { FastifyRequest } from 'fastify';
import { PrismaClient, User } from '@prisma/client';

import TMDBService from './services/TMDB';
import UserService from './services/User';
import ListService from './services/List';
import config from './config';

const prisma = new PrismaClient();

const tmdbService = new TMDBService(config.tmdbApiKey);

const userService = new UserService(prisma);
const listService = new ListService(prisma);

const services = {
  tmdb: tmdbService,
  user: userService,
  list: listService,
};

export type GraphQLContext = {
  prisma: PrismaClient;
  services: {
    tmdb: TMDBService;
    user: UserService;
    list: ListService;
  };
  currentUser: User | null;
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
    return newUser;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function contextFactory(
  request: FastifyRequest
): Promise<GraphQLContext> {
  return {
    prisma,
    services,
    currentUser: await authenticateUser(request),
  };
}
