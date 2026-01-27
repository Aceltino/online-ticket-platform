import { SignOptions } from 'jsonwebtoken';
export const jwtConfig = {
  issuer: 'identity-service',
  audience: 'online-ticket-platform',

  access: {
    secret: process.env.JWT_ACCESS_SECRET!,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']
  },

  refresh: {
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: '7d',
  },
};
