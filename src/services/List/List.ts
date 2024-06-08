import { PrismaClient } from '@prisma/client';
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

  async getRecommendations(listId: string) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { movies: true, recommendations: true },
    });
    if (!list || list.movies.length < 5) return [];

    const weekAgo = new Date().valueOf() - 7 * 24 * 60 * 60 * 1000;
    if (
      list.recommendations?.length &&
      list.recommendationsUpdatedAt &&
      list.recommendationsUpdatedAt.valueOf() > weekAgo
    ) {
      return list.recommendations;
    }

    const rawRecommendations = await this.recommendationAI.findSimilar(
      list.movies
    );
    const recommendations = await this.tmdb.findByTitleAndYear(
      rawRecommendations
    );

    await this.prisma.list.update({
      where: { id: listId },
      data: {
        recommendations: {
          connectOrCreate: recommendations.map((movie) => ({
            where: { tmdbId: movie.tmdbId },
            create: movie,
          })),
        },
        recommendationsUpdatedAt: new Date(),
      },
    });
    return recommendations;
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
