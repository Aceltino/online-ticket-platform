import { Request, Response, NextFunction } from 'express'; 
import { AuthenticatedRequest } from '../middlewares/is-authenticated';
import { CompleteProfileUseCase } from '../../../application/use-cases/complete-profile.use-case';
import { GetProfileByUserUseCase } from '../../../application/use-cases/get-profile-by-user.use-case';
import { CreateProfileUseCase } from '../../../application/use-cases/create-profile.use-case';
import { InvalidRequestError } from '@org/errors';
import { createProfileSchema } from '../schemas/create-profile.schema';
import { successResponse } from '@org/http';

export class ProfileController {
  constructor(
    private readonly getProfileByUser: GetProfileByUserUseCase,
    private readonly completeProfile: CompleteProfileUseCase,
    private readonly createProfileUseCase: CreateProfileUseCase,
  ) { }

  // Dentro do seu ProfileController no método create:

async create(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    // 1. Valida e já extrai os dados tipados (parsed.data)
    const parsed = createProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new InvalidRequestError('Dados inválidos', parsed.error.issues));
    }

    // 2. Chama o Use Case (parsed.data já é do tipo CreateProfileInput)
    await this.createProfileUseCase.execute(parsed.data);

    return res.status(201).json({ message: 'Profile created' });
  } catch (error) {
    return next(error);
  }
}

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await this.getProfileByUser.execute(req.user.id);
      res.json(successResponse(profile));
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await this.completeProfile.execute({
        userId: req.user.id,
        ...req.body,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
