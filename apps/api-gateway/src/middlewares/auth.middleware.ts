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

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token error' });
  }

  const [scheme, token] = parts;

  try {
    // 🚨 AQUI ESTAVA O ERRO: 
    // Você deve usar a SECRET (aceltino_A) e não uma PUBLIC_KEY
    // E passar as mesmas opções de Issuer/Audience do Identity
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!, // <--- Use a mesma do Identity
      {
        // Se o Identity usa issuer/audience, o Gateway DEVE validar também
        issuer: 'identity-service',      // <--- Igual ao seu config
        audience: 'online-ticket-platform' // <--- Igual ao seu config
      }
    ) as any;

    req.user = {
      id: payload.sub, // O seu Identity guarda no 'sub'
      role: payload.role,
    };

    next();
  } catch (err) {
    console.error("JWT Verify Error:", err); // Log para você debugar
    return res.status(401).json({ message: 'Invalid token' });
  }
}