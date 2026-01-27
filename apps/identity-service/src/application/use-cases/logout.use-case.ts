import { IRefreshTokenRepository } from "../ports/refresh-token-repository";

export class LogoutUseCase {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(refreshTokenId: string): Promise<void> {
    await this.refreshTokenRepository.delete(refreshTokenId);
  }
}