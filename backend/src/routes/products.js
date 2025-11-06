import { Router } from 'express';
import { listProducts } from '../controllers/productsController.js';

const router = Router();

// GET /api/products: list products
router.get('/', listProducts);

export default router;


