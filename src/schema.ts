import { makeExecutableSchema } from '@graphql-tools/schema';
import { Resolvers } from './generated/graphql';
import { GraphQLContext } from './context';
import typeDefs from './schema.graphql';
import { makeObjectResolvers } from './utils/generators';
import scalars from './utils/scalars';
import { assertCurrentUser } from './utils/validators';

type ResolversWithContext = Resolvers<GraphQLContext>;

const resolvers: ResolversWithContext = {
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
      return context.services.tmdb.search(args.query);
    },
  },
  Mutation: {
    signup: (parent, args, context, info) => {
      return context.services.user.signup(args.input);
    },
    login: (parent, args, context, info) => {
      return context.services.user.login(args.input);
    },
    followUser: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.user.follow(currentUser.id, args.id);
    },
    unfollowUser: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.user.unfollow(currentUser.id, args.id);
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
      return await context.services.list.pushMovie(args.listId, movie, currentUser.id);
    },
    pullMovie: (parent, args, context, info) => {
      const currentUser = assertCurrentUser(context);
      return context.services.list.pullMovie(args.listId, args.movieId, currentUser.id);
    },
  },
  List: makeObjectResolvers('list', [
    'owner',
    'movies',
  ]) as ResolversWithContext['List'],
  User: makeObjectResolvers('user', [
    'followers',
    'following',
    'lists',
    'savedLists',
  ]) as ResolversWithContext['User'],
  ...scalars,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
