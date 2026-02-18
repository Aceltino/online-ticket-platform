import { DocumentType } from '../../../domain/enums/document-type.enum';
import { z } from 'zod';

export const createProfileSchema = z.object({
  userId: z.string().uuid('ID de usuário inválido'),
  fullName: z.string().min(3, 'Nome muito curto'),
  countryId: z.string().min(1,'ID do país inválido'),
  documentType: z.nativeEnum(DocumentType),
  documentNumber: z.string().min(5, 'Número de documento inválido'),
  nationality: z.string().optional(),
  dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;