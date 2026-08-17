import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: AUTHENTICATION CONTROLLER (controllers/authController.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Handles User Registration, Login, and Session Verification (GET /me).
 *    - Uses `bcrypt` to hash passwords securely with salt rounds before saving.
 *    - Uses `jsonwebtoken` (JWT) to issue signed access tokens upon valid credentials.
 *
 * 2. Key Interview Explanations:
 *    - "Why don't you store plain text passwords in the database?"
 *       -> If the database is compromised, plaintext passwords expose users everywhere.
 *          Bcrypt is a one-way mathematical hashing algorithm with salting that makes
 *          rainbow table and brute-force attacks computationally infeasible.
 *    - "What is in the JWT?"
 *       -> The payload contains non-sensitive identity claims ({ id, email, name }).
 *          It is signed by our backend's secret key so tampering is immediately detected.
 * ============================================================================
 */

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_jwt_key_for_dev_12345';

// POST /api/auth/register
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check if user already exists
    const existingUserRes = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUserRes.rows.length > 0) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // 3. Hash password using bcrypt (10 salt rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Save new user into database
    const insertRes = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), normalizedEmail, hashedPassword]
    );
    const newUser = insertRes.rows[0];

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find user in database
    let userRes = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    
    // Auto-seed Demo Account if not exists
    if (userRes.rows.length === 0 && normalizedEmail === 'demo@example.com') {
      const demoHashedPassword = await bcrypt.hash('password123', 10);
      const newDemoUser = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        ['Demo Chef', 'demo@example.com', demoHashedPassword]
      );
      
      const demoId = newDemoUser.rows[0].id;
      // Seed starter pantry items
      await db.query('INSERT INTO pantry_items (user_id, name, quantity, unit) VALUES ($1, $2, $3, $4)', [demoId, 'Chicken Breast', 500, 'grams']);
      await db.query('INSERT INTO pantry_items (user_id, name, quantity, unit) VALUES ($1, $2, $3, $4)', [demoId, 'Garlic', 4, 'cloves']);
      await db.query('INSERT INTO pantry_items (user_id, name, quantity, unit) VALUES ($1, $2, $3, $4)', [demoId, 'Olive Oil', 2, 'tbsp']);
      await db.query('INSERT INTO pantry_items (user_id, name, quantity, unit) VALUES ($1, $2, $3, $4)', [demoId, 'Fresh Spinach', 200, 'grams']);
      await db.query('INSERT INTO pantry_items (user_id, name, quantity, unit) VALUES ($1, $2, $3, $4)', [demoId, 'Basmati Rice', 1, 'cup']);
      
      // Re-fetch created demo user
      userRes = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    }

    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = userRes.rows[0];

    // 3. Compare password with hashed password using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 4. Issue JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
}

// GET /api/auth/me (Protected Route)
export async function getMe(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userRes = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      user: userRes.rows[0]
    });
  } catch (error: any) {
    console.error('getMe error:', error);
    return res.status(500).json({ message: 'Internal server error fetching user.' });
  }
}
