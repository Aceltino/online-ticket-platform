import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';
import { ROLES } from '../security/roles';
import {
  identityProxy,
  profileProxy,
} from '../proxy/service-proxy';

const router: Router = Router();

/* 🔓 Públicas */
router.use('/auth', identityProxy);
// router.use('/auth/login', identityProxy);
// router.use('/auth/refresh', identityProxy);

// /* 🔐 Auth */
// router.use('/auth/me', authenticate, identityProxy);
// router.use('/auth/logout', authenticate, identityProxy);

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
