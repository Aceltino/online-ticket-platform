import { NotFoundError } from '@org/errors';
import { IUserRepository } from '../ports/user-repository.port';

export class ActivateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.activate();
    await this.userRepository.save(user);
  }
}
