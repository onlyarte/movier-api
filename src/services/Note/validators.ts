import { Note } from '@prisma/client';

export function assertNoteOwner(note: Note | null, currentUserId: string) {
  if (note && currentUserId === note.userId) {
    return note;
  }
  throw new Error('Unauthorized');
}
