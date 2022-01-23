import { PrismaClient } from '@prisma/client';

class ListService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async get(id: string) {
    return await this.prisma.list.findUnique({ where: { id } });
  }
}

export default ListService;
