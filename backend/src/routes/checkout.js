import { Router } from 'express';
import { createCheckout } from '../controllers/checkoutController.js';

const router = Router();

// POST /api/checkout: { cartItems } -> mock receipt
router.post('/', createCheckout);

export default router;


