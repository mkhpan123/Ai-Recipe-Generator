import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: AUTHENTICATION MIDDLEWARE (middleware/authMiddleware.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Intercepts incoming requests for protected routes (e.g., /api/recipes, /api/pantry).
 *    - Extracts the JSON Web Token (JWT) from the "Authorization: Bearer <token>" header.
 *    - Verifies the signature of the token using JWT_SECRET.
 *    - Decodes the token payload and attaches the logged-in user object ({ id, email, name })
 *      to `req.user`, allowing subsequent controllers to know who is making the request.
 *
 * 2. Why is this needed?
 *    - Protects private endpoints from unauthenticated access.
 *    - Ensures User A cannot modify or see User B's data (data isolation via userId).
 *
 * 3. What interview questions can be asked about it?
 *    - "What is the difference between Authentication and Authorization?"
 *       -> Authentication confirms *who you are* (verifying JWT).
 *       -> Authorization confirms *what you are allowed to do* (checking if recipe.user_id === req.user.id).
 *    - "Why do we use the Bearer scheme?"
 *       -> Bearer token is the industry standard for HTTP Authorization headers in REST APIs.
 * ============================================================================
 */

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_jwt_key_for_dev_12345';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Step 1: Read the Authorization header
  const authHeader = req.headers['authorization'];
  
  // Header format: "Bearer <token>"
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (!token) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }

  try {
    // Step 2: Verify the token with our secret
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    
    // Step 3: Attach decoded user to the request
    req.user = decoded;
    
    // Step 4: Proceed to the next middleware/controller
    next();
  } catch (error) {
    return res.status(403).json({
      message: 'Invalid or expired authentication token.'
    });
  }
}
