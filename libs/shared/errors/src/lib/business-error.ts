import { AppError } from './app-error.js';

export class BusinessError extends AppError {
  constructor(message: string, code = 'BUSINESS_ERROR', details?: unknown) {
    super(message, 400, code, details);
  }
}
