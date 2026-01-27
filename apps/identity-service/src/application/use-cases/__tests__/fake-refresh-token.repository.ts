import { IRefreshTokenRepository } from '../../ports/refresh-token-repository';

export class FakeRefreshTokenRepository
  implements IRefreshTokenRepository
{
  private tokens = new Map<string, string>();

  async save(
    refreshTokenId: string,
    userId: string,
    _expiresInSeconds: number,
  ): Promise<void> {
    this.tokens.set(refreshTokenId, userId);
  }

  async delete(refreshTokenId: string): Promise<void> {
    this.tokens.delete(refreshTokenId);
  }

  async exists(refreshTokenId: string): Promise<boolean> {
    return this.tokens.has(refreshTokenId);
  }
}
