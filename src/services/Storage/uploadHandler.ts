import { FastifyReply, FastifyRequest } from 'fastify';
import { contextFactory } from '../../context';

export default async function uploadHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const context = await contextFactory(request);
  if (!context.currentUser) {
    reply.code(401).send({ error: 'Unauthorized' });
    return;
  }

  const file = await request.file({
    limits: {
      fileSize: 5000000, // 5MB max
      files: 1,
    },
  });

  if (!file) {
    reply.code(400).send({ error: 'No file to upload' });
    return;
  }

  if (!file.mimetype?.startsWith('image/')) {
    reply.code(400).send({ error: 'Only images are allowed' });
    return;
  }

  try {
    const url = await context.services.storage.upload(file, undefined, {
      userId: context.currentUser.id,
    });
    reply.send(url);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Failed to upload the file' });
  }
}
