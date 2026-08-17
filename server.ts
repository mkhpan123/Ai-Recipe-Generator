import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/authRoutes.js';
import recipeRoutes from './server/routes/recipeRoutes.js';
import pantryRoutes from './server/routes/pantryRoutes.js';
import shoppingRoutes from './server/routes/shoppingRoutes.js';

// Load environment variables from .env if present
dotenv.config();

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: EXPRESS SERVER ENTRY POINT (server.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Creates an Express web server.
 *    - Configures middleware (CORS, JSON body parser).
 *    - Mounts REST API routes under `/api/*`.
 *    - In Development: Serves the React frontend using Vite middleware on the same port (3000).
 *    - In Production: Serves pre-built static files from the `dist/` folder.
 *
 * 2. Why Express?
 *    - "Express is a fast, unopinionated, minimalist web framework for Node.js.
 *      It provides a simple routing system and middleware pipeline, making it easy
 *      to build robust RESTful APIs."
 * ============================================================================
 */

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Health Check Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AI Recipe Generator API',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/recipes', recipeRoutes);
  app.use('/api/pantry', pantryRoutes);
  app.use('/api/shopping', shoppingRoutes);

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
      message: 'An unexpected server error occurred.'
    });
  });

  // Frontend Serving (Vite middleware in dev, Static files in production)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Recipe Generator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error during server startup:', err);
  process.exit(1);
});
