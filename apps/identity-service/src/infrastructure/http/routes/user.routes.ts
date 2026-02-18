import { Router, type Router as ExpressRouter } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserRole } from '../../../domain/enums/user-role.enum';


// Use Cases
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../../application/use-cases/get-user-by-id.use-case';
import { ActivateUserUseCase } from '../../../application/use-cases/activate-user.use-case';
import { SuspendUserUseCase } from '../../../application/use-cases/suspend-user.use-case';

// Infra
import { PrismaUserRepository } from '../../persistence/repositories/prismaUserRepository';
import { JwtTokenManager } from '../../security/jwt-token-manager';


// Middlewares
import { isAuthenticated } from '../middlewares/is-authenticated';
import { isAuthorized } from '../middlewares/is-authorized';

const router: ExpressRouter = Router();

/**
 * 🔹 Infrastructure
 */
const userRepository = new PrismaUserRepository();
const tokenManager = new JwtTokenManager();

/**
 * 🔹 Use Cases
 */
const listUsersUseCase = new ListUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const activateUserUseCase = new ActivateUserUseCase(userRepository);
const suspendUserUseCase = new SuspendUserUseCase(userRepository);

/**
 * 🔹 Controller
 */
const userController = new UserController(
  listUsersUseCase,
  getUserByIdUseCase,
  activateUserUseCase,
  suspendUserUseCase,
);

// Suas rotas abaixo...
/**
 * 🔹 Routes (ADMIN only)
 */
router.use(isAuthenticated(tokenManager))
router.use(isAuthorized([UserRole.ADMIN]));

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Administrative user management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   email:
 *                     type: string
 *                     format: email
 *                   role:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Admin role required
 */
router.get('/', userController.list.bind(userController));
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Admin role required
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getById.bind(userController));
/**
 * @swagger
 * /users/{id}/activate:
 *   patch:
 *     summary: Activate a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: User successfully activated
 *       400:
 *         description: Invalid user state
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Admin role required
 *       404:
 *         description: User not found
 */
router.patch('/:id/activate', userController.activate.bind(userController));
/**
 * @swagger
 * /users/{id}/suspend:
 *   patch:
 *     summary: Suspend a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: User successfully suspended
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Admin role required
 *       404:
 *         description: User not found
 */
router.patch('/:id/suspend', userController.suspend.bind(userController));

export { router as userRoutes };
