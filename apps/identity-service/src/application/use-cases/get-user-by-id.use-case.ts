import { NotFoundError } from '@org/errors';
import { GetUserByIdResponse } from '@org/dtos';
import { IUserRepository } from '../ports/user-repository.port';

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<GetUserByIdResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
      status: user.getStatus(),
      createdAt: user.getCreatedAt(),
    };
  }
}
