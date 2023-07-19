import { PrismaClient } from '@prisma/client';
import { CreateListInput, UpdateListInput } from '../../generated/graphql';
import { ParsedMovie } from '../TMDB/types';
import { assertListOwner } from './validators';

class ListService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async get(listId: string) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { movies: true },
    });
    if (!list) return null;
    return { ...list, movies: list.movies.reverse() };
  }

  async create(input: CreateListInput, currentUserId: string) {
    return await this.prisma.list.create({
      data: {
        ...input,
        owner: { connect: { id: currentUserId } },
      },
      include: { owner: true },
    });
  }

  async update(listId: string, input: UpdateListInput, currentUserId: string) {
    assertListOwner(await this.get(listId), currentUserId);
    return await this.prisma.list.update({
      where: { id: listId },
      data: {
        title: input.title || undefined,
        description: input.description || undefined,
        cover: input.cover || undefined,
      },
    });
  }

  async delete(listId: string, currentUserId: string) {
    assertListOwner(await this.get(listId), currentUserId);
    await this.prisma.list.delete({ where: { id: listId } });
    return true;
  }

  async save(listId: string, currentUserId: string) {
    await this.prisma.user.update({
      where: { id: currentUserId },
      data: {
        savedLists: { connect: { id: listId } },
      },
    });
    return true;
  }

  async unsave(listId: string, currentUserId: string) {
    await this.prisma.user.update({
      where: { id: currentUserId },
      data: {
        savedLists: { disconnect: { id: listId } },
      },
    });
    return true;
  }

  async pushMovie(listId: string, movie: ParsedMovie, currentUserId: string) {
    assertListOwner(await this.get(listId), currentUserId);
    await this.prisma.list.update({
      where: { id: listId },
      data: {
        movies: {
          connectOrCreate: {
            where: { tmdbId: movie.tmdbId },
            create: movie,
          },
        },
      },
    });
    return true;
  }

  async pullMovie(listId: string, movieId: number, currentUserId: string) {
    assertListOwner(await this.get(listId), currentUserId);
    await this.prisma.list.update({
      where: { id: listId },
      data: {
        movies: {
          disconnect: { tmdbId: movieId },
        },
      },
    });
    return true;
  }
}

export default ListService;
