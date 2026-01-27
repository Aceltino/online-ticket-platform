import { z } from 'zod';
import { UserRole } from '../../../domain/enums/user-role.enum';


/**
 * Schema de validação para registro de usuário
 * Valida antes de entrar no Use Case
 */
export const registerUserSchema = z.object({
  email: z
    .string()
    .email('E-mail inválido'),

  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres'),

  role: z.nativeEnum(UserRole).optional(),

});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
