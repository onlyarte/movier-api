import { List } from '@prisma/client';

export function assertListOwner(list: List | null, currentUserId: string) {
  if (list && currentUserId === list.ownerId) {
    return list;
  }
  throw new Error('Unauthorized');
}
