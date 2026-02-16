import { Response, NextFunction } from 'express';
import { GatewayRequest } from './auth.middleware';
import { Role, isRole } from '../security/roles';

export function authorize(roles: Role[]) {
  return (req: GatewayRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    const role = req.user.role;

    if (!isRole(role)) {
      return res.status(403).json({ message: 'Invalid role' });
    }

    if (!roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}
