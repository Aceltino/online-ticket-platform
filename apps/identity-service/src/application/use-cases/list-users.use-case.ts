import { IUserRepository } from '../../application/ports/user-repository.port.js';
import { ListUsersResponse } from '@org/dtos';

export class ListUsersUseCase {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async execute(): Promise<ListUsersResponse[]> {
    const users = await this.userRepository.list();

    return users.map((user) => ({
      id: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
      status: user.getStatus(),
      createdAt: user.getCreatedAt(),
    }));
  }
}
