import { IPersonRepository } from '../ports/person-repository.port';
import { NotFoundError } from '@org/errors';


export class GetProfileByUserUseCase {
  constructor(
    private readonly repository: IPersonRepository,
  ) {}

  async execute(userId: string) {
    const person = await this.repository.findByUserId(userId);

    if (!person) {
      throw new NotFoundError('Profile not found');
    }

    return {
      id: person.id,
      fullName: person.fullName,
      dateOfBirth: person.dateOfBirth,
      countryId: person.countryId,
      nationality: person.nationality,
      documentType: person.documentType,
      documentNumber: person.documentNumber,
    };
  }
}
