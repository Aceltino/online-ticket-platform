import { Router } from 'express';
import { isAuthenticated } from '../middlewares/is-authenticated';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();

router.use(isAuthenticated);

router.get('/me', controller.me.bind(controller));
router.put('/me', controller.update.bind(controller));

export { router as profileRoutes };
