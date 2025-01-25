import { FastifyReply } from 'fastify';

export const streamJson = async <T extends {}>(
  generator: AsyncGenerator<T>,
  reply: FastifyReply
) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'application/json',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'max-age=86400, no-transform',
    'Content-Encoding': 'identity',
  });
  reply.raw.flushHeaders();

  try {
    for await (const object of generator) {
      reply.raw.write(JSON.stringify(object) + '\n');
    }
  } finally {
    reply.raw.end();
  }
};
