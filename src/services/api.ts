/**
 * ============================================================================
 * INTERVIEW EXPLANATION: API CLIENT SERVICE (services/api.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Centralizes all HTTP communication between the React frontend and the Express backend.
 *    - Automatically retrieves the JWT token from `localStorage` and injects it into
 *      the `Authorization: Bearer <token>` request header.
 *    - Handles error status codes and returns structured error messages.
 *
 * 2. Key Interview Questions:
 *    - "How does React communicate with your backend?"
 *       -> "React makes asynchronous HTTP requests (GET, POST, PUT, DELETE) using standard REST APIs.
 *          Our centralized API service handles setting headers, JSON serialization, and error parsing."
 * ============================================================================
 */

import {
  AuthResponse,
  GenerateRecipePayload,
  GeneratedRecipe,
  PantryItem,
  Recipe,
  ShoppingItem,
  User
} from '../types';

const API_BASE_URL = '/api';

// Helper function to get auth headers
function getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// Generic request wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: getHeaders((options.headers as Record<string, string>) || {})
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Authentication APIs
  auth: {
    register: (userData: { name: string; email: string; password: string; confirmPassword?: string }) =>
      request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    login: (credentials: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),

    getMe: () => request<{ user: User }>('/auth/me')
  },

  // Recipe APIs
  recipes: {
    generate: (payload: GenerateRecipePayload) =>
      request<{ message: string; recipe: GeneratedRecipe }>('/recipes/generate', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),

    save: (recipeData: Omit<Recipe, 'id' | 'user_id' | 'created_at'>) =>
      request<{ message: string; recipe: Recipe }>('/recipes', {
        method: 'POST',
        body: JSON.stringify(recipeData)
      }),

    getAll: (search?: string) => {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      return request<{ recipes: Recipe[] }>(`/recipes${query}`);
    },

    getById: (id: number | string) => request<{ recipe: Recipe }>(`/recipes/${id}`),

    delete: (id: number | string) =>
      request<{ message: string }>(`/recipes/${id}`, {
        method: 'DELETE'
      })
  },

  // Pantry APIs
  pantry: {
    getAll: () => request<{ items: PantryItem[] }>('/pantry'),

    add: (item: { name: string; quantity?: number; unit?: string }) =>
      request<{ message: string; item: PantryItem }>('/pantry', {
        method: 'POST',
        body: JSON.stringify(item)
      }),

    update: (id: number, item: { name: string; quantity?: number; unit?: string }) =>
      request<{ message: string; item: PantryItem }>(`/pantry/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item)
      }),

    delete: (id: number) =>
      request<{ message: string }>(`/pantry/${id}`, {
        method: 'DELETE'
      })
  },

  // Shopping List APIs
  shopping: {
    getAll: () => request<{ items: ShoppingItem[] }>('/shopping'),

    add: (item: { name: string; quantity?: number; unit?: string }) =>
      request<{ message: string; item: ShoppingItem }>('/shopping', {
        method: 'POST',
        body: JSON.stringify(item)
      }),

    addBulk: (items: Array<{ name: string; quantity?: number; unit?: string }>) =>
      request<{ message: string; items: ShoppingItem[] }>('/shopping', {
        method: 'POST',
        body: JSON.stringify({ items })
      }),

    togglePurchased: (id: number, isPurchased: boolean) =>
      request<{ message: string; item: ShoppingItem }>(`/shopping/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isPurchased })
      }),

    delete: (id: number) =>
      request<{ message: string }>(`/shopping/${id}`, {
        method: 'DELETE'
      })
  }
};

export default api;
