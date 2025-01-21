import { PrismaClient, User } from '@prisma/client';
import { CreateListInput, UpdateListInput } from '../../generated/graphql';
import { ParsedMovie } from '../TMDB/types';
import { assertListOwner } from './validators';
import TheMovieDBService from '../TMDB';
import RecommendationAIService from '../RecommendationAI';

class ListService {
  prisma: PrismaClient;
  tmdb: TheMovieDBService;
  recommendationAI: RecommendationAIService;

  constructor(
    prisma: PrismaClient,
    tmdb: TheMovieDBService,
    recommendationAI: RecommendationAIService
  ) {
    this.prisma = prisma;
    this.tmdb = tmdb;
    this.recommendationAI = recommendationAI;
  }

  async get(listId: string) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { movies: true },
    });
    if (!list) return null;
    return { ...list, movies: list.movies.reverse() };
  }

  async getRecommendations(listId: string, currentUser?: User | null) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { movies: true, recommendations: true },
    });
    if (!list || list.movies.length < 5) return [];

    const alreadyInThisList = new Set(list.movies.map((movie) => movie.tmdbId));

    const userLists =
      currentUser &&
      (await this.prisma.list.findMany({
        where: { ownerId: currentUser.id },
        select: { movieIds: true },
      }));

    const alreadySeenByUser = new Set(
      (userLists ?? []).map((list) => list.movieIds).flat()
    );

    const weekAgo = new Date().valueOf() - 7 * 24 * 60 * 60 * 1000;
    if (
      list.recommendations?.length &&
      list.recommendationsUpdatedAt &&
      list.recommendationsUpdatedAt.valueOf() > weekAgo
    ) {
      return list.recommendations.filter(
        (movie) =>
          // don't return those that are already in the list
          !alreadyInThisList.has(movie.tmdbId) &&
          // don't return those that are in any of this user's lists
          !alreadySeenByUser.has(movie.id)
      );
    }

    const generator = this.recommendationAI.findSimilar(list, {
      user: currentUser,
    });
    let recommendations: ParsedMovie[] = [];
    for await (const { title, year } of generator) {
      try {
        const match = (await this.tmdb.search(title, year))[0];
        match && recommendations.push();
      } catch {
        // ignore
      }
    }

    await this.prisma.list.update({
      where: { id: listId },
      data: { recommendationIds: [] },
    });

    const updatedList = await this.prisma.list.update({
      where: { id: listId },
      data: {
        recommendations: {
          connectOrCreate: recommendations
            .filter((movie) => !alreadyInThisList.has(movie.tmdbId))
            .map((movie) => ({
              where: { tmdbId: movie.tmdbId },
              create: movie,
            })),
        },
        recommendationsUpdatedAt: new Date(),
      },
      include: { recommendations: true },
    });

    return updatedList.recommendations.filter(
      (movie) => !alreadySeenByUser.has(movie.id)
    );
  }

  async create(input: CreateListInput, currentUserId: string) {
    return this.prisma.list.create({
      data: {
        ...input,
        owner: { connect: { id: currentUserId } },
      },
      include: { owner: true },
    });
  }

  async createDefaults(currentUserId: string) {
    const watchlist = await this.prisma.list.create({
      data: {
        title: 'Watchlist',
        owner: { connect: { id: currentUserId } },
        watchlistOf: { connect: { id: currentUserId } },
      },
      include: { owner: true },
    });

    const favorite = await this.prisma.list.create({
      data: {
        title: 'Loved',
        owner: { connect: { id: currentUserId } },
        favouriteOf: { connect: { id: currentUserId } },
      },
      include: { owner: true },
    });

    return [watchlist, favorite];
  }

  async update(listId: string, input: UpdateListInput, currentUserId: string) {
    assertListOwner(await this.get(listId), currentUserId);
    return this.prisma.list.update({
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
        recommendations: { set: [] },
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
        recommendations: { set: [] },
        movies: {
          disconnect: { tmdbId: movieId },
        },
      },
    });
    return true;
  }
}

export default ListService;
