import { Router, type Router as ExpressRouter } from 'express';
import { prisma } from '../../persistence/prisma/prismaClient'; // Importe a instância configurada
import { ProfileController } from '../controllers/profile.controller';
import { CompleteProfileUseCase } from '../../../application/use-cases/complete-profile.use-case';
import { GetProfileByUserUseCase } from '../../../application/use-cases/get-profile-by-user.use-case';

import { PrismaPersonRepository } from '../../persistence/repositories/prismaPersonRepository';
import { extractUser } from '../middlewares/internal-auth';
import { CreateProfileUseCase } from '../../../application/use-cases/create-profile.use-case';

const router: ExpressRouter = Router();

/*
|--------------------------------------------------------------------------
| Dependency Injection (Composition Root)
|--------------------------------------------------------------------------
*/

const personRepository = new PrismaPersonRepository(prisma);


const completeProfileUseCase = new CompleteProfileUseCase(
  personRepository,
);
const createProfileUseCase = new CreateProfileUseCase(
  personRepository
);

const getProfileByUserUseCase = new GetProfileByUserUseCase(
  personRepository,
);

const controller = new ProfileController(
  getProfileByUserUseCase,
  completeProfileUseCase,
  createProfileUseCase
);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

router.post('/create', controller.create.bind(controller)); 

// --- ABAIXO DAQUI TUDO PRECISA DE TOKEN ---

// 2. Middleware de autenticação (só afeta o que vem depois)
router.use(extractUser); 

router.get('/me', controller.me.bind(controller));
router.put('/me', controller.update.bind(controller));

export { router as profileRoutes };
