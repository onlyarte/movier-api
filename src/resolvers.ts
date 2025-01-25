import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateTimeResolver } from 'graphql-scalars';
import { Resolvers } from './generated/graphql';
import { GraphQLContext } from './context';
import { makeObjectResolvers } from './utils/generators';
import { assertCurrentUser } from './utils/validators';

/// <reference path="../node_modules/graphql-import-node/register.d.ts" />
import typeDefs from './schema.graphql';
import { handleSearchGQL } from './services/Movie/handleSearch';

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
      return context.services.tmdb.get(args.tmdbId);
    },
    search: handleSearchGQL,
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
    updateUser: async (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.user.update(currentUser.id, args.input);
    },
    upsertUserLocation: async (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.user.upsertLocation(currentUser.id, args.input);
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
      const movie = await context.services.tmdb.get(args.movieTmdbId);
      return context.services.list.pushMovie(
        args.listId,
        movie,
        currentUser.id
      );
    },
    pullMovie: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.list.pullMovie(
        args.listId,
        args.movieTmdbId,
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
    addNoteToMovie: async (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      const movie = await context.services.tmdb.get(args.movieTmdbId);
      return context.services.note.create(args.content, movie, currentUser.id);
    },
    deleteNoteFromMovie: async (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      await context.services.note.delete(args.noteId, currentUser.id);
      return true;
    },
  },
  Movie: {
    notes: (parent, args, context, info) => {
      return context.services.note.findByMovieId(parent.tmdbId);
    },
    providers: (parent, args, context, info) => {
      return context.services.tmdb.getProviders(parent.tmdbId, args.region);
    },
  },
  List: {
    ...makeObjectResolvers('list', ['owner', 'movies']),
    recommendations: async (parent, args, context, info) => {
      const movies = await context.services.list.getRecommendations(
        parent.id,
        context.currentUser
      );
      return movies.map(({ id, ...movie }) => ({ ...movie, id: movie.tmdbId }));
    },
  },
  User: makeObjectResolvers('user', [
    'followers',
    'following',
    'lists',
    'savedLists',
    'watchlist',
    'favourite',
    'location',
  ]),
  Note: makeObjectResolvers('note', ['user', 'movie']),
};

export const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers,
});
