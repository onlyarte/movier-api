import { FastifyRequest } from 'fastify';
import { PrismaClient, User } from '@prisma/client';

import TMDBService from './services/TMDB';
import UserService from './services/User';
import ListService from './services/List';
import { verify } from './utils/jwt';
import config from './config';

const prisma = new PrismaClient();

const tmdbService = new TMDBService(config.tmdbApiKey);
tmdbService.init().catch((e) => console.log(e));

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

async function authenticateUser(
  prisma: PrismaClient,
  request: FastifyRequest
): Promise<User | null> {
  if (request.headers.authorization) {
    const token = request.headers.authorization.split(' ')[1];
    const tokenPayload = verify(token);
    const userId = tokenPayload.userId;

    return await prisma.user.findUnique({ where: { id: userId } });
  }

  return null;
}

export async function contextFactory(
  request: FastifyRequest
): Promise<GraphQLContext> {
  return {
    prisma,
    services,
    currentUser: await authenticateUser(prisma, request),
  };
}
