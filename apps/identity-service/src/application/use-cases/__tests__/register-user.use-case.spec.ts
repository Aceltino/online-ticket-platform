import { RegisterUserUseCase } from '../register-user.use-case';
import { FakeUserRepository } from './mocks';
import { FakePasswordHasher } from './fakePasswordHasher';
import { UserRole } from '../../../domain/enums/user-role.enum';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let repository: FakeUserRepository;

  const mockEventDispatcher = {
    dispatch: jest.fn().mockResolvedValue(undefined)
  };

  beforeEach(() => {
    repository = new FakeUserRepository();
    useCase = new RegisterUserUseCase(
      repository,
      new FakePasswordHasher() as any,
      mockEventDispatcher as any //
    );
  });

  it('should register a new user', async () => {
    const result = await useCase.execute({
      email: 'user@test.com',
      password: '12345678',
      role: UserRole.ADMIN,
    });

    expect(result.userId).toBeDefined();
    // 3. Opcional: verificar se o evento foi disparado
    expect(mockEventDispatcher.dispatch).toHaveBeenCalled();
  });

  it('should fail if email already exists', async () => {
    // Primeiro registro
    await useCase.execute({
      email: 'user@test.com',
      password: '12345678',
      role: UserRole.ADMIN,
    });

    // Segundo registro com o mesmo email deve falhar
    await expect(
      useCase.execute({
        email: 'user@test.com',
        password: '12345678',
        role: UserRole.ADMIN,
      }),
    ).rejects.toThrow('User already exists');
  });
});