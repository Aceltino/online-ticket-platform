import { prisma } from '../prisma/prismaClient';
import { IUserRepository } from '../../../application/ports/user-repository.port';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserPrismaMapper } from '../mappers/user-prisma.mapper';

export class PrismaUserRepository implements IUserRepository {

  async findByEmail(email: Email): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { email: email.getValue() }
    });

    if (!record) return null;

    return User.restore({
      id: record.id,
      email: Email.check(record.email),
      passwordHash: record.passwordHash,
      role: UserPrismaMapper.toDomainRole(record.role),
      status: UserPrismaMapper.toDomainStatus(record.status),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }

  async findById(id: string): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { id }
    });

    if (!record) return null;

    return User.restore({
      id: record.id,
      email: Email.check(record.email),
      passwordHash: record.passwordHash,
      role: UserPrismaMapper.toDomainRole(record.role),
      status: UserPrismaMapper.toDomainStatus(record.status),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }

  async list(): Promise<User[]> {
    const records = await prisma.user.findMany();

    return records.map(record =>
      User.restore({
        id: record.id,
        email: Email.check(record.email),
        passwordHash: record.passwordHash,
        role: UserPrismaMapper.toDomainRole(record.role),
        status: UserPrismaMapper.toDomainStatus(record.status),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      })
    );
  }

  async save(user: User): Promise<void> {
    await prisma.user.upsert({
      where: { id: user.getId() },
      update: {
        email: user.getEmail(),
        passwordHash: user.getPasswordHash(),
        role: user.getRole(),
        status: user.getStatus(),
      },
      create: {
        id: user.getId(),
        email: user.getEmail(),
        passwordHash: user.getPasswordHash(),
        role: user.getRole(),
        status: user.getStatus(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }

}

