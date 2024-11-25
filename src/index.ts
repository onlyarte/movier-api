import 'graphql-import-node';
import fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';

import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
} from 'graphql-helix';

import { schema } from './resolvers';
import { contextFactory } from './context';
import config from './config';
import uploadHandler from './services/Storage/uploadHandler';

async function main() {
  const server = fastify({
    logger: true,
  });

  server.register(multipart);
  await server.register(cors, {
    origin: '*',
  });

  server.route({
    method: 'POST',
    url: '/upload',
    handler: uploadHandler,
  });

  server.route({
    method: 'GET',
    url: '/graphql',
    handler: async (request, reply) => {
      reply.header('Content-Type', 'text/html');
      reply.send(
        renderGraphiQL({
          endpoint: '/graphql',
        })
      );
    },
  });

  server.route({
    method: 'POST',
    url: '/graphql',
    handler: async (request, reply) => {
      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest({
        request,
        schema,
        operationName,
        contextFactory: () => contextFactory(request),
        query,
        variables,
      });

      reply.raw.setHeader('Access-Control-Allow-Origin', '*');

      sendResult(result, reply.raw);
    },
  });

  server
    .listen({
      port: config.port,
      host: config.host,
    })
    .then(() => {
      console.log(`Server is running on http://localhost:${config.port}/`);
    });
}

main();
