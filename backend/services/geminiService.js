import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

/**
 * Service to generate abstractive text summaries using the official Google GenAI SDK
 */

// Helper to sanitize any accidental key leak from error messages
function sanitizeError(error) {
  const apiKey = process.env.GEMINI_API_KEY;
  let message = error.message || 'An error occurred during Gemini summarization.';
  if (apiKey && apiKey.length > 5) {
    message = message.split(apiKey).join('[REDACTED_API_KEY]');
  }
  return message;
}

/**
 * Generate a text summary with Google Gemini
 * @param {string} text - Raw input text to summarize
 * @param {'short'|'medium'|'detailed'} length - Desired summary length mode
 * @returns {Promise<string>} - The synthesized summary text
 */
export async function generateSummaryWithGemini(text, length = 'medium') {
  // Dynamically reload .env to seamlessly pick up newly added API keys without requiring server restart
  dotenv.config({ override: true });
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-flash-latest';

  // Strict check: never proceed without a valid configured key
  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_gemini_api_key_here') {
    const error = new Error(
      'Google Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env. Obtain an official key at https://ai.google.dev/gemini-api/docs/api-key'
    );
    error.status = 503;
    error.isConfigError = true;
    throw error;
  }

  // Define tailored instructions based on the requested length mode
  const lengthDirectives = {
    short:
      'Mode: SHORT. Provide a concise executive summary focusing ONLY on the most critical takeaways, core conclusions, and essential facts (~15-25% of original length). Use high-impact paragraphs or structured bullet points.',
    medium:
      'Mode: MEDIUM. Provide a balanced, cohesive summary capturing the main ideas, core arguments, and primary supporting details (~35-50% of original length). Maintain clear logical progression between points.',
    detailed:
      'Mode: DETAILED. Provide an in-depth, comprehensive summary that thoroughly synthesizes the main thesis, underlying evidence, methodological or contextual details, and nuanced takeaways (~60-75% of original length).',
  };

  const selectedDirective = lengthDirectives[length] || lengthDirectives.medium;

  const prompt = `You are a professional research analyst and expert text summarizer.
Your task is to summarize the following document faithfully.

CRITICAL INSTRUCTIONS:
1. ${selectedDirective}
2. Preserve the original meaning, key facts, names, dates, metrics, and quantitative numbers accurately.
3. NEVER introduce unsupported claims, hallucinations, or external interpretations.
4. Output clean, well-formatted text without conversational filler (do not start with "Here is your summary:" or "In this document...").

DOCUMENT TO SUMMARIZE:
${text}
`;

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    let response;
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
    } catch (primaryErr) {
      const is503 = primaryErr.status === 503 || primaryErr.message?.includes('503') || primaryErr.message?.includes('high demand');
      if (is503 && modelName !== 'gemini-flash-lite-latest') {
        console.warn(`[GeminiService] Model '${modelName}' hit high demand (503). Seamlessly failing over to 'gemini-flash-lite-latest'...`);
        response = await ai.models.generateContent({
          model: 'gemini-flash-lite-latest',
          contents: prompt,
        });
      } else {
        throw primaryErr;
      }
    }

    const generatedText = response.text;

    if (!generatedText || typeof generatedText !== 'string' || generatedText.trim().length === 0) {
      throw new Error('Gemini API returned an empty summary response.');
    }

    return generatedText.trim();
  } catch (err) {
    // If it's already a config error, rethrow
    if (err.isConfigError) throw err;

    const rawMsg = err.message || '';
    const status = err.status || err.statusCode;

    // Detect common Gemini API issues
    if (rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('API key not valid') || status === 400 && rawMsg.includes('key')) {
      const authErr = new Error('The configured Google Gemini API key is invalid. Please verify the key in backend/.env');
      authErr.status = 401;
      throw authErr;
    }

    if (rawMsg.includes('RESOURCE_EXHAUSTED') || status === 429) {
      const quotaErr = new Error('Google Gemini API rate limit or quota exceeded. Please wait a moment before trying again.');
      quotaErr.status = 429;
      throw quotaErr;
    }

    if (status === 403 || rawMsg.includes('PERMISSION_DENIED') || rawMsg.includes('free tier') || rawMsg.includes('billing')) {
      const permErr = new Error('Google Gemini API Permission Denied (403): The free tier is unavailable for this Google Cloud project. Enable billing at https://aistudio.google.com/billing or create an API key in a standard project at https://aistudio.google.com/app/apikey.');
      permErr.status = 403;
      throw permErr;
    }

    if (rawMsg.includes('NOT_FOUND') || (status === 404 && rawMsg.includes('model'))) {
      const modelErr = new Error(`The requested Gemini model '${modelName}' is unavailable or deprecated. Check https://ai.google.dev/gemini-api/docs/models/gemini for active model IDs.`);
      modelErr.status = 404;
      throw modelErr;
    }

    // General sanitized error
    const genericErr = new Error(sanitizeError(err));
    genericErr.status = status || 500;
    throw genericErr;
  }
}
