import { IRefreshTokenRepository } from '../../../application/ports/refresh-token-repository';
import { Redis } from 'ioredis';

export class RedisRefreshTokenRepository
  implements IRefreshTokenRepository
{
  constructor(private readonly redis: Redis) {}

  async save(
    refreshTokenId: string,
    userId: string,
    expiresInSeconds: number,
  ): Promise<void> {
    await this.redis.set(
      `refresh_token:${refreshTokenId}`,
      userId,
      'EX',
      expiresInSeconds,
    );
  }

  async delete(refreshTokenId: string): Promise<void> {
    await this.redis.del(`refresh_token:${refreshTokenId}`);
  }

  async exists(refreshTokenId: string): Promise<boolean> {
    const value = await this.redis.get(
      `refresh_token:${refreshTokenId}`,
    );
    return Boolean(value);
  }
}
