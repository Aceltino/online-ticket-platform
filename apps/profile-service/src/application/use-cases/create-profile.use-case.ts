// apps/profile-service/src/application/use-cases/create-profile.use-case.ts
import { IPersonRepository } from '../ports/person-repository.port';
import { Person } from '../../domain/entities/person.entity';
import { CreateProfileInput } from '../dtos/create-profile.input';
import { BusinessError } from '@org/errors'; // Importando o padrão do Identity

export class CreateProfileUseCase {
  constructor(private readonly repository: IPersonRepository) {}

  async execute(input: CreateProfileInput): Promise<void> {
    // 1. Validar se o usuário já tem um perfil
    const userIdExists = await this.repository.findByUserId(input.userId);
    if (userIdExists) {
      throw new BusinessError(
        'Profile already exists for this user',
        'PROFILE_ALREADY_EXISTS'
      );
    }

    // 2. Validar se o documento já está em uso por outra pessoa
    const documentExists = await this.repository.findByDocument(
      input.documentType,
      input.documentNumber
    );

    if (documentExists) {
      throw new BusinessError(
        'Document number already registered',
        'DOCUMENT_ALREADY_IN_USE'
      );
    }

    // 3. Criar e salvar
    const person = Person.create(input); 
    await this.repository.create(person);
  }
}