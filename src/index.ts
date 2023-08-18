import 'graphql-import-node';
import fastify from 'fastify';
import multipart from 'fastify-multipart';
import cors from '@fastify/cors';

import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
} from 'graphql-helix';

import { schema } from './resolvers';
import { contextFactory } from './context';
import StorageService from './services/Storage';
import config from './config';

async function main() {
  const server = fastify({
    logger: true,
  });

  server.register(multipart);
  await server.register(cors, {
    origin: '*',
  });

  const storageService = new StorageService();

  server.route({
    method: 'POST',
    url: '/file',
    handler: async (request, reply) => {
      const file = await request.file({ limits: { fileSize: 1000000 } });
      try {
        const url = await storageService.upload(file);
        reply.send(url);
      } catch (error) {
        console.log(error);
        reply.code(500).send();
      }
    },
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

  server.listen(config.port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${config.port}/`);
  });
}

main();
