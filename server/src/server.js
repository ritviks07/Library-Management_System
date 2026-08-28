import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import { initDB, getDBStatus } from './db/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: getDBStatus()
  });
});

// Mount Routes
app.use('/api/books', bookRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Initialize Database and Start Server
async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(` 📚 Athenaeum Library API Server running on port ${PORT}`);
    console.log(` 🌐 Health: http://localhost:${PORT}/api/health`);
    console.log(` 📖 Books:  http://localhost:${PORT}/api/books`);
    console.log(`================================================`);
  });
}

start();
