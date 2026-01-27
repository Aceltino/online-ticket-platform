export interface IRefreshTokenRepository {
  save(
    refreshTokenId: string,
    userId: string,
    expiresInSeconds: number,
  ): Promise<void>;

  delete(refreshTokenId: string): Promise<void>;

  exists(refreshTokenId: string): Promise<boolean>;
}
