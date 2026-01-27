import { AppError } from './app-error.js';

export class NotFoundError extends AppError {
  constructor(resource: string, details?: unknown) {
    super(`${resource} not found`, 404, 'NOT_FOUND', details);
  }
}
