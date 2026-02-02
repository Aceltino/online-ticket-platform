import { prisma } from '../prisma/prismaClient';
import { IPersonRepository } from '../../../application/ports/person-repository.port';
import { Person } from '../../../domain/entities/person.entity';

export class PrismaPersonRepository implements IPersonRepository {
  async create(person: Person): Promise<void> {
    await prisma.person.create({
      data: {
        id: person.id,
        userId: person.userId,
        fullName: person.fullName,
        countryId: person.countryId,
        documentType: person.documentType,
        documentNumber: person.documentNumber,
        nationality: person.nationality,
        dateOfBirth: person.dateOfBirth,
      },
    });
  }

  async findByUserId(userId: string): Promise<Person | null> {
    const record = await prisma.person.findUnique({
      where: { userId },
    });

    if (!record) return null;

    return Person.restore({
      id: record.id,
      userId: record.userId,
      fullName: record.fullName,
      countryId: record.countryId,
      documentType: record.documentType,
      documentNumber: record.documentNumber,
      nationality: record.nationality ?? undefined,
      dateOfBirth: record.dateOfBirth ?? undefined,
    });
  }
}
