import { Response, NextFunction } from 'express';
import { ForbiddenError } from '@org/errors';
import { AuthenticatedRequest } from './is-authenticated';
import { UserRole } from '../../../domain/enums/user-role.enum';

export const isAuthorized =
  (allowedRoles: UserRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        // Em vez de throw, use next para garantir que o Express capture
        return next(new ForbiddenError('Usuário não autenticado'));
      }

      if (!allowedRoles.includes(user.role as UserRole)) {
        return next(new ForbiddenError('Acesso negado'));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
