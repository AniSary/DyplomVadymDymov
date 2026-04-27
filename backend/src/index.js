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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || './data/tracker.db';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/sync', syncRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error'
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
║   Finansowy Tracker Backend Server Running     ║
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
