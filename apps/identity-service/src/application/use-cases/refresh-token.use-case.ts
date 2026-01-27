import { UnauthorizedError } from '@org/errors';

import { ITokenManager } from '../ports/token-manager.port';
import { IRefreshTokenRepository } from '../ports/refresh-token-repository';

const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenManager: ITokenManager,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken: string) {
    // 1️⃣ Verify signature and extract payload
    const payload = await this.tokenManager.verify(refreshToken);

    if (!payload?.sub) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // 2️⃣ chekk if refresh token is revoked
    const exists = await this.refreshTokenRepo.exists(refreshToken);
console.log('Refresh token exists:', exists);
    if (!exists) {
      throw new UnauthorizedError('Refresh token revoked');
    }

    // 3️⃣ rm the last refresh token
    await this.refreshTokenRepo.delete(refreshToken);

    // 4️⃣ generate new tokens
    const tokenPair = await this.tokenManager.generate({
      sub: payload.sub,
      role: payload.role,
    });

    // 5️⃣ save new refresh token
    await this.refreshTokenRepo.save(
      tokenPair.refreshToken,
      payload.sub,
      REFRESH_TOKEN_TTL_SECONDS,
    );

    // 6️⃣ return new token pair
    return tokenPair;
  }
}
