import { Router } from 'express';
import {
  getPantryItems,
  addPantryItem,
  updatePantryItem,
  deletePantryItem
} from '../controllers/pantryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// All pantry routes are protected by JWT authentication
router.use(authenticateToken);

router.get('/', getPantryItems);
router.post('/', addPantryItem);
router.put('/:id', updatePantryItem);
router.delete('/:id', deletePantryItem);

export default router;
