import pino from 'pino';

const loggerInstance = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true }
        }
      : undefined
});

export interface Logger {
  info(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  debug(message: string, meta?: unknown): void;
}

export const logger: Logger = {
  info: (message, meta) => loggerInstance.info(meta, message),
  error: (message, meta) => loggerInstance.error(meta, message),
  warn: (message, meta) => loggerInstance.warn(meta, message),
  debug: (message, meta) => loggerInstance.debug(meta, message)
};
