// src/index.js
// Главное приложение Express с инициализацией базы данных

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import DatabaseService from './services/DatabaseService.js';
import syncRoutes from './routes/sync.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler } from './middleware/validation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || './data/tracker.db';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? '⚠️' : '✅';
    console.log(
      `${logLevel} [${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`
    );
  });
  next();
});

// Global health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'spendly-backend',
    version: '2.0.0',
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/sync', syncRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      path: req.path,
      method: req.method
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  
  // Определяем статус код
  const statusCode = err.statusCode || err.status || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message || 'Internal server error',
      ...(NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
});

// Инициализация и запуск сервера
async function startServer() {
  try {
    console.log('🔧 Initializing database...');
    await DatabaseService.init(DB_PATH);
    console.log('✅ Database initialized');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔════════════════════════════════════════════════╗
║     Spendly Backend Server Running             ║
╠════════════════════════════════════════════════╣
║                                                ║
║  📍 Listening on: http://localhost:${PORT}
║  📊 DB Path: ${DB_PATH}
║  🔄 Sync Engine: Last-Write-Wins
║  📈 Analytics: Advanced Forecasting
║                                                ║
║  Available endpoints:                          ║
║  • POST   /api/sync/push                       ║
║  • POST   /api/sync/pull                       ║
║  • POST   /api/sync/merge                      ║
║  • GET    /api/sync/status                     ║
║  • GET    /api/analytics/summary               ║
║  • GET    /api/analytics/trends                ║
║  • GET    /api/analytics/forecast              ║
║  • GET    /api/analytics/recommendations       ║
║  • GET    /api/analytics/comparison            ║
║                                                ║
╚════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down...');
  await DatabaseService.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down...');
  await DatabaseService.close();
  process.exit(0);
});

startServer();

export default app;
