import { Request, Response, NextFunction } from 'express';
import { AppError } from '@org/errors';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // 🟢 Erros de aplicação / domínio
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }

  // 🔴 Erro inesperado (bug, infra, etc)
  console.error('[UNEXPECTED ERROR]', error);

  return res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
