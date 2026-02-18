import 'dotenv/config';
import { prisma } from './infrastructure/persistence/prisma/prismaClient'; // Importe a instância configurada
import { PrismaPersonRepository } from './infrastructure/persistence/repositories/prismaPersonRepository';
import { CreateProfileUseCase } from './application/use-cases/create-profile.use-case';
import { CompleteProfileUseCase } from './application/use-cases/complete-profile.use-case';
import { GetProfileByUserUseCase } from './application/use-cases/get-profile-by-user.use-case';

/*
|--------------------------------------------------------------------------
| Repositories
|--------------------------------------------------------------------------
*/
const personRepository = new PrismaPersonRepository(prisma);
/*
|--------------------------------------------------------------------------
| Use Cases
|--------------------------------------------------------------------------
*/
export const createProfileUseCase = new CreateProfileUseCase(
  personRepository,
);

export const completeProfileUseCase = new CompleteProfileUseCase(
  personRepository,
);

export const getProfileByUserUseCase = new GetProfileByUserUseCase(
  personRepository,
);
