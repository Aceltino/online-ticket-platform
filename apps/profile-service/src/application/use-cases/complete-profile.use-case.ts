import { IPersonRepository } from '../ports/person-repository.port';
import { DocumentType } from '../../domain/enums/document-type.enum';

interface CompleteProfileInput {
  userId: string;
  fullName: string;
  dateOfBirth?: Date;
  countryId: string;
  nationality?: string;
  documentType: DocumentType;
  documentNumber: string;
}

export class CompleteProfileUseCase {
  constructor(
    private readonly repository: IPersonRepository,
  ) {}

  async execute(input: CompleteProfileInput): Promise<void> {
    const person = await this.repository.findByUserId(input.userId);

    if (!person) {
      throw new Error('Profile not initialized');
    }

    person.complete({
      fullName: input.fullName,
      dateOfBirth: input.dateOfBirth,
      countryId: input.countryId,
      nationality: input.nationality,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
    });

    await this.repository.update(person);
  }
}
