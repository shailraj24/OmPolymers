// Express Server Entry Point with Vite Middlewares integration
import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { apiRouter } from './src/server/routes.js';
import { openApiSpec } from './src/server/openapi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Body parser with 25mb limit for image uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Security Headers matching Phase 11
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });

  // Serve physical uploaded files from /uploads directory
  const uploadsDir = path.resolve(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Allowed public file extensions for uploads security
  const allowedUploadExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']);

  app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
    // Prevent dotfiles and directory traversal
    const safePath = path.normalize(req.path);
    if (safePath.includes('..') || req.path.includes('/.')) {
      return res.status(403).json({ success: false, message: 'Access denied: Directory traversal forbidden.' });
    }
    const ext = path.extname(safePath).toLowerCase();
    if (ext && !allowedUploadExts.has(ext)) {
      return res.status(403).json({ success: false, message: 'File format not allowed for public serving.' });
    }
    next();
  }, express.static(uploadsDir, {
    maxAge: '1d',
    etag: true,
    dotfiles: 'ignore',
    setHeaders: (res: Response) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }));

  // Fallback 404 for missing uploaded files
  app.use('/uploads', (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Uploaded file not found on backend storage.',
      errors: ['File does not exist or has been removed.']
    });
  });

  // OpenAPI schema endpoint
  app.get('/api/docs/openapi.json', (_req: Request, res: Response) => {
    res.json(openApiSpec);
  });

  // Mount OM Polymer REST API routes
  app.use('/api', apiRouter);

  // Global Exception Handling matching Phase 11 ExceptionMiddleware
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Server Exception:', err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? err.message : 'An internal server error occurred. Please try again later.',
      data: null,
      errors: process.env.NODE_ENV === 'development' ? [err.stack || ''] : ['Internal server failure']
    });
  });

  // Development vs Production serving
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OM Polymer API Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
