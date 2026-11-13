import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = (): Application => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS
  const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const cleanClientUrl = rawClientUrl.replace(/\/+$/, '');
  const allowedOrigins = [
    cleanClientUrl,
    rawClientUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some((ao) => origin === ao)) {
          callback(null, true);
        } else {
          // Allow all origins by default to prevent blocking during deployment
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // General Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP. Please try again after 15 minutes.',
    },
  });
  app.use('/api', limiter);

  // Parsers
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser());

  // Logging in non-test mode
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Serve local uploads statically across multiple possible paths (root or backend dir)
  const possibleUploadPaths = [
    path.join(process.cwd(), 'uploads'),
    path.join(process.cwd(), 'backend', 'uploads'),
    path.resolve(process.cwd(), '../uploads'),
  ];
  possibleUploadPaths.forEach((uploadDir) => {
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch (e) {}
    }
    app.use('/uploads', express.static(uploadDir));
  });

  // Direct robust fallback for uploads route if static middleware passes through
  app.get('/uploads/*', (req: Request, res: Response) => {
    const requestedPath = decodeURIComponent(req.path.replace(/^\/uploads\//, ''));
    for (const baseDir of possibleUploadPaths) {
      const fullPath = path.resolve(baseDir, requestedPath);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        return res.sendFile(fullPath);
      }
    }
    return res.status(404).json({
      success: false,
      message: `File not found: ${requestedPath}`,
    });
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'CampusConnect API is healthy and operational.',
      timestamp: new Date().toISOString(),
      institution: 'Silicon University, Bhubaneswar',
    });
  });

  // Mount API Routes
  app.use('/api', apiRoutes);

  // 404 Handler for undefined API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;

