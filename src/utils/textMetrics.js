/**
 * Utilities for analyzing text metrics (word count, character count, reading time)
 */

export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  // Match word characters considering international characters and apostrophes
  const words = trimmed.match(/\b\S+\b/g);
  return words ? words.length : 0;
}

export function countCharacters(text, includeSpaces = true) {
  if (!text || typeof text !== 'string') return 0;
  return includeSpaces ? text.length : text.replace(/\s/g, '').length;
}

export function estimateReadingTime(words, wpm = 200) {
  if (!words || words <= 0) return '0 min';
  const minutes = words / wpm;
  if (minutes < 0.5) return '< 30 sec';
  if (minutes < 1) return '< 1 min';
  const rounded = Math.ceil(minutes);
  return `${rounded} min read`;
}

export function calculateReduction(originalCount, summaryCount) {
  if (!originalCount || originalCount <= 0 || !summaryCount) return 0;
  if (summaryCount >= originalCount) return 0;
  const reduction = ((originalCount - summaryCount) / originalCount) * 100;
  return Math.round(reduction);
}

export function generateTitleFromText(text, maxLength = 60) {
  if (!text) return 'Untitled Summary';
  const firstSentence = text.trim().split(/[.\n]/)[0].trim();
  if (firstSentence.length <= maxLength) {
    return firstSentence || 'Summary Document';
  }
  return firstSentence.substring(0, maxLength).trim() + '...';
}
