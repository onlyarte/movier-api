import { PrismaClient } from '@prisma/client';

import TMDB from './services/TMDB';

const prisma = new PrismaClient();

const tmdb = new TMDB(process.env.TMDB_API_KEY as string);
tmdb.init().catch((e) => console.log(e));

export type GraphQLContext = {
  prisma: PrismaClient;
  tmdb: TMDB;
};

export async function contextFactory(): Promise<GraphQLContext> {
  return { prisma, tmdb };
}
