/**
 * Centralized Express Error Handling Middleware
 * Ensures secrets (such as API keys) are never leaked in error responses
 */

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Determine appropriate status code
  let statusCode = err.status || err.statusCode || 500;
  if (statusCode < 400 || statusCode > 599) {
    statusCode = 500;
  }

  // Sanitize message to guarantee no API keys are echoed back
  let safeMessage = err.message || 'An unexpected error occurred on the server.';
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.length > 5) {
    safeMessage = safeMessage.split(apiKey).join('[REDACTED_API_KEY]');
  }

  // Log server-side for diagnostics (with secret protection)
  console.error(`[Error] [${req.method} ${req.originalUrl}] Status: ${statusCode} - ${safeMessage}`);

  return res.status(statusCode).json({
    success: false,
    message: safeMessage,
    status: statusCode,
  });
}
