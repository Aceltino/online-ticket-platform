import { DocumentType } from '../../domain/enums/document-type.enum';

export interface CreateProfileInput {
  userId: string;
  fullName: string;
  countryId: string;
  documentType: DocumentType;
  documentNumber: string;
  nationality?: string;
  dateOfBirth?: Date;
}
