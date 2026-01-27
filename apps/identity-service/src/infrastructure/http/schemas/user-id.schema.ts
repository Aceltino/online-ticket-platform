import { z } from 'zod';

/**
 * Schema de validação para parâmetros que contêm ID de usuário
 * Usado em rotas: /users/:id
 */
export const userIdParamSchema = z.object({
  id: z
    .string()
    .uuid('ID de usuário inválido'),
});

export type UserIdParamSchema = z.infer<typeof userIdParamSchema>;
