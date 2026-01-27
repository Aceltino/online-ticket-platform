import { Request, Response, NextFunction } from 'express';

import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { AuthenticateUserUseCase } from '../../../application/use-cases/authenticate-user.use-case';
import { RefreshTokenUseCase } from '../../../application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../../../application/use-cases/logout.use-case';


import { registerUserSchema } from '../schemas/register-user.schema';
import { loginUserSchema } from '../schemas/login-user.schema';
import { refreshTokenSchema } from '../schemas/refresh-user.schema';
import { logoutSchema } from '../schemas/logout-user.schema';

import { InvalidRequestError } from '@org/errors';
import { successResponse } from '@org/http';
import { AuthenticatedRequest } from '../middlewares/is-authenticated';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) { }

  async register(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const parsed = registerUserSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new InvalidRequestError(
          'Invalid request data',
          parsed.error.issues,
        );
      }

      const result = await this.registerUserUseCase.execute(parsed.data);

      return res.status(201).json(
        successResponse({
          id: result.userId,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const parsed = loginUserSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new InvalidRequestError(
          'Invalid request data',
          parsed.error.issues,
        );
      }

      const result = await this.authenticateUserUseCase.execute(parsed.data);

      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const parsed = refreshTokenSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new InvalidRequestError(
          'Invalid request data',
          parsed.error.issues,
        );
      }

      const tokens = await this.refreshTokenUseCase.execute(
        parsed.data.refreshToken,
      );

      return res.status(200).json(successResponse(tokens));
    } catch (error) {
      next(error);
    }
  }

  async me( req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      return res.status(200).json(
        successResponse({
          user: req.user,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

    async logout( req: Request, res: Response,next: NextFunction ): Promise<any> {
    try {
      // 1️⃣ Validação (Adapter HTTP)
      const parsed = logoutSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new InvalidRequestError(
          'Invalid request data',
          parsed.error.issues,
        );
      }

      // 2️⃣ Use Case
      await this.logoutUseCase.execute(parsed.data.refreshToken);

      // 3️⃣ Resposta HTTP
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

}
