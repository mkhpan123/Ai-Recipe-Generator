import { Router } from 'express';
import {
  generateRecipe,
  saveRecipe,
  getSavedRecipes,
  getRecipeById,
  deleteRecipe
} from '../controllers/recipeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// All recipe actions require authentication
router.use(authenticateToken);

// Recipe Generation with Gemini AI
router.post('/generate', generateRecipe);

// Saved Recipes CRUD
router.get('/', getSavedRecipes);
router.post('/', saveRecipe);
router.get('/:id', getRecipeById);
router.delete('/:id', deleteRecipe);

export default router;
