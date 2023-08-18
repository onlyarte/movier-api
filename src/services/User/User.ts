import axios, { AxiosInstance } from 'axios';
import { PrismaClient } from '@prisma/client';
import { setupCache } from 'axios-cache-adapter';

class UserService {
  prisma: PrismaClient;
  private auth0: AxiosInstance;

  constructor(prisma: PrismaClient, auth0Domain: string) {
    this.prisma = prisma;

    this.auth0 = axios.create({
      baseURL: auth0Domain,
      adapter: setupCache({}).adapter,
    });
  }

  async get(id: string) {
    return await this.prisma.user.findFirst({
      where: id.length === 24 ? { OR: [{ id }, { sub: id }] } : { sub: id },
    });
  }

  async create({
    sub,
    email,
    name,
    picture,
  }: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  }) {
    return await this.prisma.user.create({
      data: {
        sub,
        email,
        name,
        photoUrl: picture,
      },
    });
  }

  async follow(currentUserId: string, followingId: string) {
    return await this.prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: { connect: { id: followingId } },
      },
      include: { following: true },
    });
  }

  async unfollow(currentUserId: string, followingId: string) {
    return await this.prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: { disconnect: { id: followingId } },
      },
      include: { following: true },
    });
  }

  async authInfo(auth0Token: string) {
    const { data } = await this.auth0.get('/userinfo', {
      headers: {
        Authorization: auth0Token,
      },
    });
    return data;
  }
}

export default UserService;
