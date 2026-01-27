import { NotFoundError } from '@org/errors';
import { IUserRepository } from '../ports/user-repository.port';
export class SuspendUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    user.suspend();
    await this.userRepository.save(user);
  }
}
