import { PrismaClient } from '@prisma/client';
import { assertNoteOwner } from './validators';
import { Movie } from '../Movie/TMDB/types';

class NoteService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async get(id: string) {
    return this.prisma.note.findUnique({
      where: { id },
    });
  }

  async findByMovieId(movieTmdbId: number) {
    return this.prisma.movie
      .findUnique({ where: { tmdbId: movieTmdbId } })
      .notes({ orderBy: { createdAt: 'desc' } });
  }

  async create(content: string, movie: Movie, userId: string) {
    return this.prisma.note.create({
      data: {
        content,
        user: {
          connect: { id: userId },
        },
        movie: {
          connectOrCreate: {
            where: { tmdbId: movie.tmdbId },
            create: movie as any,
          },
        },
      },
    });
  }

  async update(id: string, content: string, currentUserId: string) {
    assertNoteOwner(await this.get(id), currentUserId);
    return this.prisma.note.update({
      where: { id },
      data: { content },
    });
  }

  async delete(id: string, currentUserId: string) {
    return this.prisma.note.deleteMany({
      where: { id, userId: currentUserId },
    });
  }
}

export default NoteService;
