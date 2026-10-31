import { generateSummaryWithGemini } from '../services/geminiService.js';
import dotenv from 'dotenv';

// Accurate word count calculator
function countWords(str) {
  if (!str || typeof str !== 'string') return 0;
  const matches = str.trim().match(/\b\S+\b/g);
  return matches ? matches.length : 0;
}

const ALLOWED_LENGTHS = ['short', 'medium', 'detailed'];
const MAX_INPUT_CHARS = 100000; // ~20,000 words limit
const MIN_INPUT_WORDS = 10;

/**
 * Handle POST /api/summarize
 */
export async function summarizeTextHandler(req, res, next) {
  try {
    const { text, length = 'medium', title } = req.body;

    // 1. Validate text presence and type
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Input text is required. Please provide text to summarize.',
      });
    }

    const trimmedText = text.trim();

    // 2. Validate input size limits
    if (trimmedText.length > MAX_INPUT_CHARS) {
      return res.status(400).json({
        success: false,
        message: `Input text exceeds the maximum allowed length of ${MAX_INPUT_CHARS.toLocaleString()} characters (~20,000 words).`,
      });
    }

    const originalWordCount = countWords(trimmedText);
    if (originalWordCount < MIN_INPUT_WORDS) {
      return res.status(400).json({
        success: false,
        message: `Input text is too short (${originalWordCount} words). Please provide at least ${MIN_INPUT_WORDS} words so the model has adequate context.`,
      });
    }

    // 3. Validate length option
    const normalizedLength = (length || 'medium').toString().toLowerCase().trim();
    if (!ALLOWED_LENGTHS.includes(normalizedLength)) {
      return res.status(400).json({
        success: false,
        message: `Invalid summary length '${length}'. Allowed options are: 'short', 'medium', 'detailed'.`,
      });
    }

    // 4. Generate summary using Gemini
    const summary = await generateSummaryWithGemini(trimmedText, normalizedLength);
    const summaryWordCount = countWords(summary);

    // 5. Return success payload
    return res.status(200).json({
      success: true,
      summary,
      originalWordCount,
      summaryWordCount,
      length: normalizedLength,
      title: title?.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle GET /api/health
 */
export function healthCheckHandler(req, res) {
  dotenv.config({ override: true });
  const hasApiKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY.trim() !== 'your_gemini_api_key_here'
  );

  return res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'AI Text Summarizer API',
    version: '1.0.0',
    geminiConfigured: hasApiKey,
    model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
    timestamp: new Date().toISOString(),
  });
}
