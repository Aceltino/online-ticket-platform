import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/is-authenticated';
import { CompleteProfileUseCase } from '../../../application/use-cases/complete-profile.use-case';
import { GetProfileByUserUseCase } from '../../../application/use-cases/get-profile-by-user.use-case';
import { successResponse } from '@org/http';

export class ProfileController {
  constructor(
    private readonly getProfileByUser: GetProfileByUserUseCase,
    private readonly completeProfile: CompleteProfileUseCase,
  ) {}

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
