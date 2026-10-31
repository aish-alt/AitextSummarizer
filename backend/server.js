import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import summarizeRoutes from './routes/summarizeRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables from backend/.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5174,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing with reasonable 2MB payload ceiling
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Root health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'AI Text Summarizer API',
    version: '1.0.0',
    model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
    geminiConfigured: Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      process.env.GEMINI_API_KEY.trim() !== 'your_gemini_api_key_here'
    ),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', summarizeRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ AI Text Summarizer Backend Server`);
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Gemini Model: ${process.env.GEMINI_MODEL || 'gemini-flash-latest'}`);
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY.trim() !== 'your_gemini_api_key_here'
  );
  console.log(`🔑 Gemini API Key: ${hasKey ? 'Configured ✅' : 'Missing or Placeholder ⚠️ (Configure in backend/.env)'}`);
  console.log(`====================================================`);
});

export default app;
