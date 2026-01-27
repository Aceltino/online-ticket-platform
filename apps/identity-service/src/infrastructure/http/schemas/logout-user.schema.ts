import { z } from 'zod';

/**
 * Schema de validação para logout
 * Garante que o refreshToken seja informado corretamente
 */
export const logoutSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token é obrigatório'),
});

export type LogoutSchema = z.infer<typeof logoutSchema>;
