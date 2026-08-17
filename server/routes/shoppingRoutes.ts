import { Router } from 'express';
import {
  getShoppingItems,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem
} from '../controllers/shoppingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// All shopping list routes are protected by JWT authentication
router.use(authenticateToken);

router.get('/', getShoppingItems);
router.post('/', addShoppingItem);
router.put('/:id', updateShoppingItem);
router.delete('/:id', deleteShoppingItem);

export default router;
