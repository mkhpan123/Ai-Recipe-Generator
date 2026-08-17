import { Request, Response } from 'express';
import db from '../db/index.js';
import { generateRecipeWithGemini } from '../services/geminiService.js';

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: RECIPE CONTROLLER (controllers/recipeController.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Handles AI Recipe Generation and CRUD operations for Saved Recipes.
 *    - Connects the client request to the Gemini AI service.
 *    - Enforces authorization: users can only fetch or delete recipes matching their `user_id`.
 *
 * 2. Key Interview Explanations:
 *    - "How do you store arrays (like ingredients & instructions) in PostgreSQL?"
 *       -> We serialize them as clean JSON strings (`JSON.stringify()`) when storing,
 *          and parse them back (`JSON.parse()`) when returning to the client.
 *    - "Show me an example of an Authorization check in your code."
 *       -> In `deleteRecipe`: `DELETE FROM recipes WHERE id = $1 AND user_id = $2`
 *          This guarantees that even if a malicious user guesses recipe ID 42, they cannot
 *          delete it unless their JWT `user_id` matches the owner of that recipe.
 * ============================================================================
 */

// POST /api/recipes/generate
export async function generateRecipe(req: Request, res: Response) {
  try {
    const { ingredients, dietaryPreference, cuisine, cookingTime, difficulty, servings } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one ingredient.' });
    }

    // Clean and filter ingredients
    const cleanedIngredients = ingredients
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);

    if (cleanedIngredients.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one valid ingredient.' });
    }

    const recipe = await generateRecipeWithGemini({
      ingredients: cleanedIngredients,
      dietaryPreference,
      cuisine,
      cookingTime,
      difficulty,
      servings: Number(servings) || 2
    });

    return res.status(200).json({
      message: 'Recipe generated successfully',
      recipe
    });
  } catch (error: any) {
    console.error('Recipe generation error:', error);
    return res.status(500).json({
      message: error.message || 'Unable to generate recipe right now. Please try again later.'
    });
  }
}

// POST /api/recipes (Save Recipe)
export async function saveRecipe(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      title,
      description,
      ingredients,
      instructions,
      cuisine,
      difficulty,
      prepTime,
      cookTime,
      servings
    } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Title, ingredients, and instructions are required.' });
    }

    // Convert arrays/objects to JSON strings for SQL persistence
    const ingredientsJson = typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients);
    const instructionsJson = typeof instructions === 'string' ? instructions : JSON.stringify(instructions);

    const result = await db.query(
      `INSERT INTO recipes 
       (user_id, title, description, ingredients, instructions, cuisine, difficulty, prep_time, cook_time, servings)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        userId,
        title.trim(),
        description || '',
        ingredientsJson,
        instructionsJson,
        cuisine || 'Any',
        difficulty || 'Medium',
        Number(prepTime) || 15,
        Number(cookTime) || 20,
        Number(servings) || 2
      ]
    );

    const saved = result.rows[0];

    return res.status(201).json({
      message: 'Recipe saved successfully',
      recipe: {
        ...saved,
        ingredients: JSON.parse(saved.ingredients),
        instructions: JSON.parse(saved.instructions)
      }
    });
  } catch (error: any) {
    console.error('Save recipe error:', error);
    return res.status(500).json({ message: 'Internal server error saving recipe.' });
  }
}

// GET /api/recipes (Get All Saved Recipes for User)
export async function getSavedRecipes(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await db.query('SELECT * FROM recipes WHERE user_id = $1', [userId]);

    // Parse JSON arrays for ingredients and instructions
    let recipes = result.rows.map(row => ({
      ...row,
      ingredients: typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : row.ingredients,
      instructions: typeof row.instructions === 'string' ? JSON.parse(row.instructions) : row.instructions
    }));

    // Optional client search filter
    const search = req.query.search as string;
    if (search && search.trim()) {
      const q = search.toLowerCase();
      recipes = recipes.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.cuisine?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({ recipes });
  } catch (error: any) {
    console.error('Get recipes error:', error);
    return res.status(500).json({ message: 'Internal server error fetching recipes.' });
  }
}

// GET /api/recipes/:id
export async function getRecipeById(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const recipeId = req.params.id;

    const result = await db.query('SELECT * FROM recipes WHERE id = $1 AND user_id = $2', [recipeId, userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    const row = result.rows[0];
    const recipe = {
      ...row,
      ingredients: typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : row.ingredients,
      instructions: typeof row.instructions === 'string' ? JSON.parse(row.instructions) : row.instructions
    };

    return res.status(200).json({ recipe });
  } catch (error: any) {
    console.error('Get recipe by ID error:', error);
    return res.status(500).json({ message: 'Internal server error fetching recipe details.' });
  }
}

// DELETE /api/recipes/:id
export async function deleteRecipe(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const recipeId = req.params.id;

    await db.query('DELETE FROM recipes WHERE id = $1 AND user_id = $2', [recipeId, userId]);

    return res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error: any) {
    console.error('Delete recipe error:', error);
    return res.status(500).json({ message: 'Internal server error deleting recipe.' });
  }
}
