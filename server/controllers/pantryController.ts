import { Request, Response } from 'express';
import db from '../db/index.js';

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: PANTRY CONTROLLER (controllers/pantryController.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Provides standard CRUD (Create, Read, Update, Delete) endpoints for Pantry items.
 *    - Connects with the "Use My Pantry" button on the recipe generator page.
 *
 * 2. Key Interview Explanations:
 *    - "Explain one CRUD operation from your project."
 *       -> Create: POST /api/pantry -> `INSERT INTO pantry_items (user_id, name, quantity, unit) VALUES ($1, $2, $3, $4)`
 *       -> Read:   GET /api/pantry  -> `SELECT * FROM pantry_items WHERE user_id = $1`
 *       -> Update: PUT /api/pantry/:id -> `UPDATE pantry_items SET name = $1, quantity = $2, unit = $3 WHERE id = $4 AND user_id = $5`
 *       -> Delete: DELETE /api/pantry/:id -> `DELETE FROM pantry_items WHERE id = $1 AND user_id = $2`
 * ============================================================================
 */

// GET /api/pantry
export async function getPantryItems(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await db.query('SELECT * FROM pantry_items WHERE user_id = $1', [userId]);
    return res.status(200).json({ items: result.rows });
  } catch (error: any) {
    console.error('Get pantry error:', error);
    return res.status(500).json({ message: 'Internal server error fetching pantry items.' });
  }
}

// POST /api/pantry
export async function addPantryItem(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, quantity, unit } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Ingredient name is required.' });
    }

    const result = await db.query(
      'INSERT INTO pantry_items (user_id, name, quantity, unit) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name.trim(), quantity ? Number(quantity) : null, unit ? unit.trim() : '']
    );

    return res.status(201).json({
      message: 'Pantry item added successfully',
      item: result.rows[0]
    });
  } catch (error: any) {
    console.error('Add pantry item error:', error);
    return res.status(500).json({ message: 'Internal server error adding pantry item.' });
  }
}

// PUT /api/pantry/:id
export async function updatePantryItem(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const itemId = req.params.id;
    const { name, quantity, unit } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Ingredient name is required.' });
    }

    const result = await db.query(
      'UPDATE pantry_items SET name = $1, quantity = $2, unit = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [name.trim(), quantity ? Number(quantity) : null, unit ? unit.trim() : '', itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pantry item not found.' });
    }

    return res.status(200).json({
      message: 'Pantry item updated successfully',
      item: result.rows[0]
    });
  } catch (error: any) {
    console.error('Update pantry item error:', error);
    return res.status(500).json({ message: 'Internal server error updating pantry item.' });
  }
}

// DELETE /api/pantry/:id
export async function deletePantryItem(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const itemId = req.params.id;

    await db.query('DELETE FROM pantry_items WHERE id = $1 AND user_id = $2', [itemId, userId]);

    return res.status(200).json({ message: 'Pantry item deleted successfully' });
  } catch (error: any) {
    console.error('Delete pantry item error:', error);
    return res.status(500).json({ message: 'Internal server error deleting pantry item.' });
  }
}
