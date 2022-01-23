import { PrismaClient } from '@prisma/client';

import TMDBService from './services/TMDB';
import UserService from './services/User';
import ListService from './services/List';

const prisma = new PrismaClient();

const tmdbService = new TMDBService(process.env.TMDB_API_KEY as string);
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
};

export async function contextFactory(): Promise<GraphQLContext> {
  return { prisma, services };
}
