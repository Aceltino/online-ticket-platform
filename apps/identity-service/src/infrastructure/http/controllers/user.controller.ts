import { Request, Response, NextFunction } from 'express';

import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../../application/use-cases/get-user-by-id.use-case';
import { ActivateUserUseCase } from '../../../application/use-cases/activate-user.use-case';
import { SuspendUserUseCase } from '../../../application/use-cases/suspend-user.use-case';

import { userIdParamSchema } from '../schemas/user-id.schema';

import { InvalidRequestError } from '@org/errors';
import { successResponse } from '@org/http';

export class UserController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly suspendUserUseCase: SuspendUserUseCase,
  ) { }

  async list( _req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const users = await this.listUsersUseCase.execute();
console.log('Cheguei no Controller List!');
      res.json(
        successResponse(users),
      );
    } catch (error) {
      next(error);
    }
  }

  async getById( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const parsed = userIdParamSchema.safeParse(req.params);

      if (!parsed.success) {
        throw new InvalidRequestError(
          'Invalid request params',
          parsed.error.issues,
        );
      }

      const user = await this.getUserByIdUseCase.execute(parsed.data.id);

      res.json(
        successResponse(user),
      );
    } catch (error) {
      next(error);
    }
  }

  async activate( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const parsed = userIdParamSchema.safeParse(req.params);

      if (!parsed.success) {
        throw new InvalidRequestError(
          'Invalid request params',
          parsed.error.issues,
        );
      }

      await this.activateUserUseCase.execute(parsed.data.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async suspend( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const parsed = userIdParamSchema.safeParse(req.params);

      if (!parsed.success) {
        throw new InvalidRequestError(
          'Invalid request params',
          parsed.error.issues,
        );
      }

      await this.suspendUserUseCase.execute(parsed.data.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
