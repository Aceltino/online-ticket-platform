import { Request, Response, NextFunction } from 'express';

export interface InternalRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export function extractUser(
  req: InternalRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role');

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = {
    id: userId,
    role: role!,
  };

  next();
}
