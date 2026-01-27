import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@org/errors';
import { ITokenManager } from '../../../application/ports/token-manager.port';
import { UserRole } from '../../../domain/enums/user-role.enum';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const isAuthenticated =
  (tokenManager: ITokenManager) =>
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedError('Token não informado');
      }

      const [, token] = authHeader.split(' ');

      if (!token) {
        throw new UnauthorizedError('Token mal formado');
      }
console.log('Verifying token:', token);
      const payload = await tokenManager.verifyAccessToken(token);

      req.user = {
        id: payload.sub,
        role: payload.role,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
