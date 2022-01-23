import { PrismaClient } from '@prisma/client';

import TMDBService from './services/TMDB';
import UserService from './services/User';

const prisma = new PrismaClient();

const tmdbService = new TMDBService(process.env.TMDB_API_KEY as string);
tmdbService.init().catch((e) => console.log(e));

const userService = new UserService(prisma);

const services = {
  tmdb: tmdbService,
  user: userService,
};

export type GraphQLContext = {
  prisma: PrismaClient;
  services: {
    tmdb: TMDBService;
    user: UserService;
  }
};

export async function contextFactory(): Promise<GraphQLContext> {
  return { prisma, services };
}
