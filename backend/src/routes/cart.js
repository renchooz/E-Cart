import { Router } from 'express';
import { getCart, addToCart, updateCartItem, deleteCartItem } from '../controllers/cartController.js';

const router = Router();

// GET /api/cart: Get cart + total
router.get('/', getCart);

// POST /api/cart: Add { productId, qty }
router.post('/', addToCart);

// PATCH /api/cart/:id: Update qty
router.patch('/:id', updateCartItem);

// DELETE /api/cart/:id: Remove item
router.delete('/:id', deleteCartItem);

export default router;


