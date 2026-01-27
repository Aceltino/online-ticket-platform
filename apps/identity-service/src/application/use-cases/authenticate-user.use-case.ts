import { IUserRepository } from '../ports/user-repository.port';
import { IPasswordHasher } from '../ports/password-hasher.port';
import { ITokenManager } from '../ports/token-manager.port';
import { IRefreshTokenRepository } from '../ports/refresh-token-repository';
import { BusinessError, UnauthorizedError } from '@org/errors';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { Email } from '../../domain/value-objects/email.vo';
import {
  AuthenticateUserRequest,
  AuthenticatedUserResponse,
} from '@org/dtos';

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenManager: ITokenManager,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(
    input: AuthenticateUserRequest,
  ): Promise<AuthenticatedUserResponse> {
    const email = Email.check(input.email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const passwordValid = await this.passwordHasher.compare(
      input.password,
      user.getPasswordHash(),
    );

    if (!passwordValid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    if (user.getStatus() !== UserStatus.ACTIVE) {
      throw new BusinessError('Usuário não está ativo');
    }

    const tokens = await this.tokenManager.generate({
      sub: user.getId(),
      role: user.getRole(),
    });

    // 🔐 Persistência do refresh token
    await this.refreshTokenRepository.save(
      tokens.refreshToken!,
      user.getId(),
      60 * 60 * 24 * 7, // 7 dias
    );

    return {
      user: {
        id: user.getId(),
        email: user.getEmail(),
        role: user.getRole(),
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
