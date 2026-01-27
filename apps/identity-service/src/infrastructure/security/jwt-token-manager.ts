import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import {
  ITokenManager,
  TokenPair,
  TokenPayload,
} from '../../application/ports/token-manager.port';
import { jwtConfig } from '../../config/jwt.config';
import { UnauthorizedError } from '@org/errors';
import { UserRole } from '../../domain/enums/user-role.enum';

export class JwtTokenManager implements ITokenManager {

    async generate(payload: TokenPayload): Promise<TokenPair> {
    const refreshTokenId = randomUUID();

    const accessToken = jwt.sign(
      payload,
      jwtConfig.access.secret,
      {
        expiresIn: jwtConfig.access.expiresIn,
        algorithm: 'HS256',
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      } as SignOptions
    );

    const refreshToken = jwt.sign(
      {
        sub: payload.sub,
        role: payload.role,
        jti: refreshTokenId,
      },
      jwtConfig.refresh.secret,
      {
        expiresIn: jwtConfig.refresh.expiresIn,
        algorithm: 'HS256',
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      } as SignOptions
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(
        token,
        jwtConfig.access.secret,
        {
          issuer: jwtConfig.issuer,
          audience: jwtConfig.audience,
        }
      ) as JwtPayload;

      return {
        sub: decoded.sub as string,
        role: decoded.role as UserRole,
      };
    } catch {
      throw new UnauthorizedError('Token inválido ou expirado');
    }
  }

  //just refresh token verification
  async verify(token: string): Promise<TokenPayload> {
    const decoded = jwt.verify(
      token,
      jwtConfig.refresh.secret,
    ) as JwtPayload;

    return {
      sub: decoded.sub as string,
      role: decoded.role,
    };
  }
}
