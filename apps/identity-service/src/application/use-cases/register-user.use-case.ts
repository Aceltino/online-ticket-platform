import { IUserRepository } from '../ports/user-repository.port';
import { IPasswordHasher } from '../ports/password-hasher.port';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserRole } from '../../domain/enums/user-role.enum';
import { BusinessError } from '@org/errors';
import { EventDispatcher } from '../ports/event-dispatcher.port';
import { UserCreatedEvent } from '../../domain/events/user-created.event';

export interface RegisterUserInput {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterUserOutput {
  userId: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly eventDispatcher: EventDispatcher
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {

    const email =  Email.check(input.email);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
    throw new BusinessError(
        'User already exists with this email',
        'USER_ALREADY_EXISTS'
    );
    }
    // Hash password
    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = User.createNew({
      email,
      passwordHash,
      role: input.role
    });

    await this.userRepository.save(user);

    await this.eventDispatcher.dispatch(
      new UserCreatedEvent({
        userId: user.getId(),
        email: user.getEmail(),
        role: user.getRole(),
      })
    );

    return {
      userId: user.getId()
    };
  }
}
