import { IPersonRepository } from '../ports/person-repository.port';
import { Person } from '../../domain/entities/person.entity';
import { CreateProfileInput } from '../dtos/create-profile.input';

export class CreateProfileUseCase {
  constructor(
    private readonly repository: IPersonRepository,
  ) {}

  async execute(input: CreateProfileInput): Promise<void> {
    const exists = await this.repository.findByUserId(input.userId);

    if (exists) return;

    const person = Person.create({
      userId: input.userId,
      fullName: input.fullName,
      countryId: input.countryId,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
      nationality: input.nationality,
      dateOfBirth: input.dateOfBirth,
    });

    await this.repository.create(person);
  }
}

