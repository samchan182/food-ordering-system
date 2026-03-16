import { Router } from 'express';
import { checkout } from '../controllers/checkoutController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.post('/', requireAuth, checkout);

export default router;
