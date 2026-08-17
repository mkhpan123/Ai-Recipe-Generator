/**
 * ============================================================================
 * INTERVIEW EXPLANATION: TYPESCRIPT TYPE DEFINITIONS (types/index.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Defines shared TypeScript interfaces representing our domain models:
 *      User, PantryItem, Recipe, ShoppingItem, and API request/response payloads.
 *
 * 2. Why TypeScript?
 *    - Provides static type checking, compile-time error detection, and great IDE auto-complete,
 *      preventing runtime bugs such as typos in database column names or missing JSON fields.
 * ============================================================================
 */

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PantryItem {
  id: number;
  user_id: number;
  name: string;
  quantity: number | null;
  unit: string;
  created_at: string;
}

export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  difficulty: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  created_at: string;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  nutritionSummary?: string;
}

export interface GenerateRecipePayload {
  ingredients: string[];
  dietaryPreference: string;
  cuisine: string;
  cookingTime: string;
  difficulty: string;
  servings: number;
}

export interface ShoppingItem {
  id: number;
  user_id: number;
  name: string;
  quantity: number;
  unit: string;
  is_purchased: boolean;
  created_at: string;
}
