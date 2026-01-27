import { AppError } from './app-error.js';

export class InvalidRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(
      message,
      400,
      'INVALID_REQUEST',
      details
    );
  }
}
