import { PrismaClient } from '@prisma/client';
import { firestore } from './firebase';

class UserService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async get(id: string, includeLocation = false) {
    return this.prisma.user.findFirst({
      where: {
        OR: [...(id.length === 24 ? [{ id }] : []), { sub: id }, { email: id }],
      },
      include: includeLocation ? { location: true } : undefined,
    });
  }

  async create(
    {
      sub,
      email,
      name,
      photoUrl,
    }: {
      sub: string;
      email: string;
      name: string;
      photoUrl?: string;
    },
    includeLocation = false
  ) {
    return this.prisma.user.create({
      data: {
        sub,
        email,
        name,
        photoUrl,
      },
      include: includeLocation ? { location: true } : undefined,
    });
  }

  async update(
    currentUserId: string,
    {
      name,
      photoUrl,
      about,
    }: {
      name?: string | null;
      photoUrl?: string | null;
      about?: string | null;
    }
  ) {
    return this.prisma.user.update({
      where: { id: currentUserId },
      data: {
        name: name ?? undefined,
        photoUrl,
        about,
      },
    });
  }

  async upsertLocation(
    currentUserId: string,
    payload: {
      country?: string | null;
      region?: string | null;
      city?: string | null;
      ip?: string | null;
      timezone?: string | null;
    }
  ) {
    await this.prisma.userLocation.upsert({
      where: {
        userId: currentUserId,
      },
      update: payload,
      create: {
        user: { connect: { id: currentUserId } },
        ...payload,
      },
    });

    return true;
  }

  async follow(currentUserId: string, followingId: string) {
    return this.prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: { connect: { id: followingId } },
      },
      include: { following: true },
    });
  }

  async unfollow(currentUserId: string, followingId: string) {
    return this.prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: { disconnect: { id: followingId } },
      },
      include: { following: true },
    });
  }

  async authInfo(base64Token: string) {
    const sessionToken = Buffer.from(base64Token, 'base64').toString('ascii');

    const sessionSnapshot = await firestore
      .collection('sessions')
      .where('sessionToken', '==', sessionToken)
      .get();

    if (sessionSnapshot.empty) {
      throw new Error('Session not found');
    }

    const session = sessionSnapshot.docs[0]?.data();

    const userSnapshot = await firestore
      .collection('users')
      .doc(session.userId)
      .get();

    const user = userSnapshot.data();
    if (!user) throw new Error('User not found');

    return {
      sub: session.userId,
      email: user.email,
      name: user.name,
      // photoUrl: user.image,
    };
  }
}

export default UserService;
