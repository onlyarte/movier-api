import { makeExecutableSchema } from '@graphql-tools/schema';
import { Resolvers } from './generated/graphql';
import { GraphQLContext } from './context';
import typeDefs from './schema.graphql';
import { makeObjectResolvers } from './utils/generators';
import scalars from './utils/scalars';

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
