import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';
import { ROLES } from '../security/roles';
import { identityProxy, profileProxy } from '../proxy/service-proxy';
import { RegistrationController } from '../controllers/registration.controller';

const registrationController = new RegistrationController();

// Esta rota é orquestrada pelo BFF

const router: Router = Router();

router.post('/complete-register', registrationController.register.bind(registrationController));

/* 🔓 Públicas */
router.use('/auth', identityProxy);

/* 🔐 Profile */
router.use('/profiles', authenticate, profileProxy);

/* 🔐 Admin */
router.use(
  '/users',
  authenticate,
  authorize([ROLES.ADMIN]),
  identityProxy
);

export default router;
