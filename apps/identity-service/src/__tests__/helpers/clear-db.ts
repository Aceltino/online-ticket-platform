import { prisma } from '../../infrastructure/persistence/prisma/prismaClient';

export async function clearDatabase() {
  await prisma.user.deleteMany();
}
