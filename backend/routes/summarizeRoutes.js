import { Router } from 'express';
import { summarizeTextHandler, healthCheckHandler } from '../controllers/summarizeController.js';

const router = Router();

// Health check endpoint: GET /api/health
router.get('/health', healthCheckHandler);

// Summarize endpoint: POST /api/summarize
router.post('/summarize', summarizeTextHandler);

export default router;
