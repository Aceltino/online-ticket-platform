import { z } from 'zod';

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;
