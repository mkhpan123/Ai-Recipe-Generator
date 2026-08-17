import { Request, Response } from 'express';
import db from '../db/index.js';

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: SHOPPING CONTROLLER (controllers/shoppingController.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Manages the user's shopping list items (create, view, toggle purchased, delete).
 *    - Allows one-click adding of missing ingredients from a generated recipe.
 *
 * 2. Key Interview Explanations:
 *    - "How does marking an item as purchased work in the backend?"
 *       -> An HTTP PUT request is sent to `/api/shopping/:id` with `{ isPurchased: true/false }`.
 *          The backend runs an UPDATE query scoped to `user_id` to toggle the boolean.
 * ============================================================================
 */

// GET /api/shopping
export async function getShoppingItems(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await db.query('SELECT * FROM shopping_items WHERE user_id = $1', [userId]);
    return res.status(200).json({ items: result.rows });
  } catch (error: any) {
    console.error('Get shopping items error:', error);
    return res.status(500).json({ message: 'Internal server error fetching shopping items.' });
  }
}

// POST /api/shopping (Add Single or Multiple Items)
export async function addShoppingItem(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Support single item or bulk array from generated recipe
    const { items, name, quantity, unit } = req.body;

    if (Array.isArray(items)) {
      const addedItems = [];
      for (const it of items) {
        if (it && it.name && it.name.trim()) {
          const result = await db.query(
            'INSERT INTO shopping_items (user_id, name, quantity, unit, is_purchased) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, it.name.trim(), it.quantity ? Number(it.quantity) : 1, it.unit || '', false]
          );
          addedItems.push(result.rows[0]);
        }
      }
      return res.status(201).json({
        message: `${addedItems.length} items added to shopping list`,
        items: addedItems
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Item name is required.' });
    }

    const result = await db.query(
      'INSERT INTO shopping_items (user_id, name, quantity, unit, is_purchased) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name.trim(), quantity ? Number(quantity) : 1, unit ? unit.trim() : '', false]
    );

    return res.status(201).json({
      message: 'Shopping item added successfully',
      item: result.rows[0]
    });
  } catch (error: any) {
    console.error('Add shopping item error:', error);
    return res.status(500).json({ message: 'Internal server error adding shopping item.' });
  }
}

// PUT /api/shopping/:id (Update is_purchased or quantity)
export async function updateShoppingItem(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const itemId = req.params.id;
    const { isPurchased, is_purchased, name, quantity, unit } = req.body;

    const purchasedVal = isPurchased !== undefined ? isPurchased : is_purchased;

    const result = await db.query(
      'UPDATE shopping_items SET is_purchased = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [Boolean(purchasedVal), itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Shopping item not found.' });
    }

    return res.status(200).json({
      message: 'Shopping item updated successfully',
      item: result.rows[0]
    });
  } catch (error: any) {
    console.error('Update shopping item error:', error);
    return res.status(500).json({ message: 'Internal server error updating shopping item.' });
  }
}

// DELETE /api/shopping/:id
export async function deleteShoppingItem(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const itemId = req.params.id;

    await db.query('DELETE FROM shopping_items WHERE id = $1 AND user_id = $2', [itemId, userId]);

    return res.status(200).json({ message: 'Shopping item deleted successfully' });
  } catch (error: any) {
    console.error('Delete shopping item error:', error);
    return res.status(500).json({ message: 'Internal server error deleting shopping item.' });
  }
}
