import { AuthenticateUserUseCase } from '../authenticate-user.use-case';
import { FakeUserRepository } from './mocks';
import { FakePasswordHasher } from './fakePasswordHasher';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { UserStatus } from '../../../domain/enums/user-status.enum';
import { FakeRefreshTokenRepository } from './fake-refresh-token.repository';


const fakeTokenManager = {
    generate: async () => ({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
    }),
};

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserUseCase;
  let repository: FakeUserRepository;

  beforeEach(async () => {
    repository = new FakeUserRepository();

    const user = User.restore({
      id: 'user-1',
      email: Email.check('user@test.com'),
      passwordHash: 'hashed-12345678',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repository.save(user);

    useCase = new AuthenticateUserUseCase(
      repository,
      new FakePasswordHasher() as any,
      fakeTokenManager as any,
      new FakeRefreshTokenRepository(),
    );
  });

  it('should authenticate successfully', async () => {
    const result = await useCase.execute({
      email: 'user@test.com',
      password: '12345678',
    });

    expect(result.accessToken).toBeDefined();
  });

  it('should fail if password is wrong', async () => {
    await expect(
      useCase.execute({
        email: 'user@test.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Credenciais inválidas');
  });

  it('should fail if user is suspended', async () => {
    const suspendedUser = User.restore({
      id: '2',
      email: Email.check('suspended@test.com'),
      passwordHash: 'hashed-12345678',
      role: UserRole.ADMIN,
      status: UserStatus.SUSPENDED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repository.save(suspendedUser);

    await expect(
      useCase.execute({
        email: 'suspended@test.com',
        password: '12345678',
      }),
    ).rejects.toThrow('Usuário não está ativo');
  });
});

