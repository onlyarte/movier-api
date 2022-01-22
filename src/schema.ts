import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLContext } from './context';
import { Resolvers } from './generated/graphql';
import typeDefs from './schema.graphql';
import scalars from './utils/scalars';

const resolvers: Resolvers<GraphQLContext> = {
  Query: {
    search: (parent, args, context, info) => context.tmdb.search(args.query),
    movie: (parent, args, context, info) => context.tmdb.getMovie(args.id),
    list: (parent, args, context, info) =>
      context.prisma.list.findUnique({ where: { id: args.id } }),
  },
  List: {
    owner: async (parent, args, context, info) => {
      const result = await context.prisma.list
        .findUnique({ where: { id: parent.id } })
        .owner();
      return result!;
    },
    movies: async (parent, args, context, info) => {
      return await context.prisma.list
        .findUnique({ where: { id: parent.id } })
        .movies();
    },
  },
  ...scalars,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
