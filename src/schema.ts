import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './schema.graphql';

const resolvers = {
  Query: {
    search: () => [],
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
