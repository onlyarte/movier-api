import { contextFactory, GraphQLContext } from '../../context';
import { Movie } from './TMDB/types';
import { QueryResolvers } from '../../generated/graphql';
import { FastifyReply, FastifyRequest } from 'fastify';
import { streamJson } from '../../utils/streamJson';
import { z } from 'zod';

export const handleSearchGQL: QueryResolvers<GraphQLContext>['search'] = async (
  parent,
  args,
  context,
  info
) => {
  const direct = await context.services.tmdb.search(args.input);
  if (direct[0]?.title.toLowerCase().startsWith(args.input.toLowerCase())) {
    return direct;
  }

  try {
    const generator = context.services.recommendationAI.search(args.input, {
      user: context.currentUser,
    });
    const results: Movie[] = [];
    for await (const { title, year } of generator) {
      try {
        const match = (await context.services.tmdb.search(title, year))[0];
        match && results.push(match);
      } catch {
        // ignore
      }
    }
    return results;
  } catch (error) {
    console.error(error);
    return direct;
  }
};

const QueryParams = z.object({
  input: z.string(),
});

export const toGenerator = async function* <T = any>(array: T[]) {
  for (const item of array) {
    yield item;
  }
};

export const handleSearchRest = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const context = await contextFactory(request);

  const args = QueryParams.parse(request.query);

  const titleSearchResults = await context.services.tmdb.search(args.input);
  const isMatchFound = titleSearchResults[0]?.title
    .toLowerCase()
    .startsWith(args.input.toLowerCase());

  const generator = isMatchFound
    ? toGenerator(titleSearchResults)
    : context.services.tmdb.findAll(
        context.services.recommendationAI.search(args.input, {
          user: context.currentUser,
        })
      );

  streamJson(generator, reply);
};
