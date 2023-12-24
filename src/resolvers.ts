import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateTimeResolver } from 'graphql-scalars';
import { Resolvers } from './generated/graphql';
import { GraphQLContext } from './context';
import { makeObjectResolvers } from './utils/generators';
import { assertCurrentUser } from './utils/validators';

/// <reference path="../node_modules/graphql-import-node/register.d.ts" />
import typeDefs from './schema.graphql';

type ResolversWithContext = Resolvers<GraphQLContext>;

export const resolvers: ResolversWithContext = {
  Date: DateTimeResolver,
  Query: {
    user: (parent, args, context, info) => {
      return context.services.user.get(args.id);
    },
    list: (parent, args, context, info) => {
      return context.services.list.get(args.id);
    },
    movie: (parent, args, context, info) => {
      return context.services.tmdb.get(args.id);
    },
    search: (parent, args, context, info) => {
      return context.services.tmdb.search(args.input);
    },
  },
  Mutation: {
    followUser: async (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      await context.services.user.follow(currentUser.id, args.id);
      return true;
    },
    unfollowUser: async (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      await context.services.user.unfollow(currentUser.id, args.id);
      return true;
    },
    createList: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.list.create(args.input, currentUser.id);
    },
    updateList: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.list.update(args.id, args.input, currentUser.id);
    },
    deleteList: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.list.delete(args.id, currentUser.id);
    },
    saveList: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.list.save(args.id, currentUser.id);
    },
    unsaveList: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.list.unsave(args.id, currentUser.id);
    },
    pushMovie: async (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      const movie = await context.services.tmdb.get(args.movieId);
      return await context.services.list.pushMovie(
        args.listId,
        movie,
        currentUser.id
      );
    },
    pullMovie: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.list.pullMovie(
        args.listId,
        args.movieId,
        currentUser.id
      );
    },
    importMoviesFromImdb: async (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      for (const imdbId of args.imdbIds) {
        const movie = await context.services.tmdb.findByExternalId(imdbId);
        if (movie) {
          await context.services.list.pushMovie(
            args.listId,
            movie,
            currentUser.id
          );
        }
      }
      return true;
    },
  },
  Movie: {
    id: (parent) => {
      return parent.tmdbId;
    },
    providers: (parent, args, context, info) => {
      return context.services.tmdb.getProviders(parent.tmdbId, args.region);
    },
  },
  List: {
    ...makeObjectResolvers('list', ['owner', 'movies']),
    recommendations: async (parent, args, context, info) => {
      const recommendations =
        await context.services.recommendationAI.findSimilar(
          (parent as any).movies ??
            (await context.prisma.list.findUnique({
              where: { id: parent.id },
            }).movies)
        );
      const searchResults = await Promise.all(
        recommendations.map((one) =>
          context.services.tmdb.search(one.title, one.year)
        )
      );
      // TODO: Save recommendations to DB to avoid making too many requests
      return searchResults.map((one) => one[0]).filter(Boolean);
    },
  },
  User: makeObjectResolvers('user', [
    'followers',
    'following',
    'lists',
    'savedLists',
  ]),
};

export const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers,
});
