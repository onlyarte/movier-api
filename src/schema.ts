import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './schema.graphql';

import TMDB from './services/TMDB';

const tmdb = new TMDB(process.env.TMDB_API_KEY as string);
tmdb.init().catch((e) => console.log(e));

const resolvers = {
  Query: {
    search: (parent: unknown, args: { query: string }) =>
      tmdb.search(args.query),
    movie: (parent: unknown, args: { id: number }) =>
      tmdb.getMovie(args.id),
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
