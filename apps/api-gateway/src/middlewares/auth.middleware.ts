import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface GatewayUser {
  id: string;
  role: string;
}

export interface GatewayRequest extends Request {
  user?: GatewayUser;
}

export function authenticate(
  req: GatewayRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_PUBLIC_KEY!
    ) as any;

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
