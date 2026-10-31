import apiClient from './api';
import { countWords } from '../utils/textMetrics';

/**
 * Service to request AI text summarization from the backend (powered by Google Gemini)
 *
 * Backend endpoint expected:
 * POST /api/summarize
 * Body: { text: string, length: 'short' | 'medium' | 'detailed', title?: string }
 * Response: {
 *   success: true,
 *   data: {
 *     title: string,
 *     summary: string,
 *     length: string,
 *     originalWordCount: number,
 *     summaryWordCount: number,
 *     id?: string,
 *     createdAt?: string
 *   }
 * }
 */

export async function summarizeText({ text, length = 'medium', title = '' }) {
  // Frontend pre-validation
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Please enter or paste some text to summarize.');
  }

  const wordCount = countWords(text);
  if (wordCount < 15) {
    throw new Error('Please provide at least 15 words so the AI model has sufficient context to summarize.');
  }

  try {
    const payload = {
      text: text.trim(),
      length: length.toLowerCase(),
      title: title.trim() || undefined,
      originalWordCount: wordCount,
    };

    const response = await apiClient.post('/summarize', payload);

    // Backend may return data nested or direct
    const responseData = response.data?.data || response.data;

    return {
      success: true,
      data: {
        id: responseData.id || responseData._id || `sum_${Date.now()}`,
        title: responseData.title || title || 'Summary Document',
        summary: responseData.summary || responseData.result || '',
        length: responseData.length || length,
        originalWordCount: responseData.originalWordCount || wordCount,
        summaryWordCount: responseData.summaryWordCount || countWords(responseData.summary || ''),
        createdAt: responseData.createdAt || new Date().toISOString(),
        originalText: text,
      },
    };
  } catch (error) {
    // Propagate structured error without fake fallbacks
    return {
      success: false,
      error: error.message || 'Failed to generate summary from backend.',
      isNetworkError: Boolean(error.isNetworkError),
      status: error.status,
      baseUrl: error.baseUrl,
    };
  }
}
