import crypto from 'crypto';

import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { UserCreatedEvent } from '@org/events';

export class UserCreatedConsumer {
  constructor(
    private readonly createProfile: CreateProfileUseCase,
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    await this.createProfile.execute({
      userId: event.payload.userId,
      fullName: 'UNKNOWN',
      countryId: 'UNKNOWN',
      documentType: DocumentType.ID_CARD,
      documentNumber: crypto.randomUUID(),
    });
  }
}
