import { PrismaClient } from '@prisma/client';
import { LoginInput, SignupInput } from '../../generated/graphql';
import { decrypt, encrypt } from '../../utils/crypto';
import { EXPIRES_IN_SECONDS, sign } from '../../utils/jwt';

class UserService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async get(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async signup(input: SignupInput) {
    const user = await this.prisma.user.create({
      data: {
        ...input,
        password: encrypt(input.password),
      },
    });

    const { token, expiresAt } = sign({ userId: user.id });
    return { user, token, expiresAt };
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) {
      throw new Error('Could not find the user');
    }
    if (input.password !== decrypt(user?.password)) {
      throw new Error('The password is wrong');
    }

    const { token, expiresAt } = sign({ userId: user.id });
    return { user, token, expiresAt };
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
}

export default UserService;
