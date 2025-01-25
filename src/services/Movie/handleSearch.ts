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

export const handleSearchRest = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const context = await contextFactory(request);

  const args = QueryParams.parse(request.query);

  const directMatches = await context.services.tmdb.search(args.input);
  if (
    directMatches[0]?.title.toLowerCase().startsWith(args.input.toLowerCase())
  ) {
    reply.header('Transfer-Encoding', '');
    reply.send(directMatches);
    return;
  }

  const generator = context.services.recommendationAI.search(args.input, {
    user: context.currentUser,
  });
  streamJson(context.services.tmdb.findAll(generator), reply);
};
