// apps/identity-service/src/application/use-cases/delete-user.use-case.ts
import { IUserRepository } from "../ports/user-repository.port";

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}