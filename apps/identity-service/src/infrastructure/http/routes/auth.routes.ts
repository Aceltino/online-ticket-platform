import { Router, type Router as ExpressRouter } from 'express';

import { AuthController } from '../controllers/auth.controller';
import { RabbitMQEventDispatcher } from '../../events/rabbitmq-event-dispatcher';


// Use Cases
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { AuthenticateUserUseCase } from '../../../application/use-cases/authenticate-user.use-case';
import { RefreshTokenUseCase } from '../../../application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../../../application/use-cases/logout.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';


// Infra
import { PrismaUserRepository } from '../../persistence/repositories/prismaUserRepository';
import { BcryptPasswordHasher } from '../../security/bcrypt-password-hasher';
import { JwtTokenManager } from '../../security/jwt-token-manager';
import { createRedisClient } from '../../persistence/redis/client';
import { RedisRefreshTokenRepository } from '../../persistence/redis/redis-refresh-token.repository';

// Middlewares
import { isAuthenticated } from '../middlewares/is-authenticated';

const router: ExpressRouter = Router();

/**
 * 🔹 Infrastructure (Adapters)
 */
const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenManager = new JwtTokenManager();
const refreshTokenRepository = new RedisRefreshTokenRepository(createRedisClient());
const eventDispatcher = new RabbitMQEventDispatcher();

/**
 * 🔹 Use Cases
 */
const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  passwordHasher,
  eventDispatcher
);

const authenticateUserUseCase = new AuthenticateUserUseCase(
  userRepository,
  passwordHasher,
  tokenManager,
  refreshTokenRepository,
);

const refreshTokenUseCase = new RefreshTokenUseCase(
  tokenManager,
  refreshTokenRepository,
);

const logoutUseCase = new LogoutUseCase(
  refreshTokenRepository,
);

const deleteUserUseCase = new DeleteUserUseCase(userRepository);

/**
 * 🔹 Controller
 */
const authController = new AuthController(
  registerUserUseCase,
  authenticateUserUseCase,
  refreshTokenUseCase,
  logoutUseCase,
  deleteUserUseCase
);

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and session management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: StrongPass123
 *               role:
 *                 type: string
 *                 enum: [PASSENGER, ADMIN]
 *                 example: PASSENGER
 *     responses:
 *       201:
 *         description: User successfully registered
 *       409:
 *         description: User already exists
 */
router.post('/register', authController.register.bind(authController));
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and generate tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login.bind(authController));
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New tokens generated
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', authController.refresh.bind(authController));
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user and invalidate refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       204:
 *         description: Successfully logged out
 */
router.post('/logout', isAuthenticated(tokenManager), authController.logout.bind(authController));
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get authenticated user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user data
 *       401:
 *         description: Unauthorized
 */
router.get('/me', isAuthenticated(tokenManager), authController.me.bind(authController));

router.delete('/:id', authController.deleteUser.bind(authController));

export { router as authRoutes };
