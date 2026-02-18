import { IPersonRepository } from '../ports/person-repository.port';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { BusinessError } from '@org/errors'; //

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
    // 1. Validar se o perfil existe
    const person = await this.repository.findByUserId(input.userId);

    if (!person) {
      throw new BusinessError(
        'Profile not found for this user',
        'PROFILE_NOT_FOUND'
      );
    }

    // 2. Validar se este documento já pertence a OUTRA pessoa
    // Importante: usamos findByDocument para evitar duplicidade no banco
    const documentOwner = await this.repository.findByDocument(
      input.documentType,
      input.documentNumber
    );

    // Se o documento já existe e não pertence ao usuário atual, barramos.
    if (documentOwner && documentOwner.userId !== input.userId) {
      throw new BusinessError(
        'This document is already registered to another account',
        'DOCUMENT_ALREADY_IN_USE'
      );
    }

    // 3. Atualizar a entidade de domínio
    person.complete({
      fullName: input.fullName,
      dateOfBirth: input.dateOfBirth,
      countryId: input.countryId,
      nationality: input.nationality,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
    });

    // 4. Persistir as mudanças
    await this.repository.update(person);
  }
}