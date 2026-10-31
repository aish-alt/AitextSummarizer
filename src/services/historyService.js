import apiClient from './api';

const LOCAL_STORAGE_KEY = 'aitextsummarizer_history_v1';

/**
 * Summary History Service
 * Designed for full MongoDB backend integration with graceful local cache fallback
 *
 * Backend Endpoints:
 * GET    /api/history      -> { success: true, data: [...] }
 * POST   /api/history      -> { success: true, data: savedItem }
 * DELETE /api/history/:id  -> { success: true, message: 'Deleted' }
 * DELETE /api/history      -> { success: true, message: 'Cleared' }
 */

// Helper to get local cache
function getLocalCache() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Could not read from localStorage:', e);
    return [];
  }
}

// Helper to save local cache
function setLocalCache(items) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Could not write to localStorage:', e);
  }
}

/**
 * Fetch history list
 * @returns {Promise<{ items: Array, syncedWithBackend: boolean, error?: string }>}
 */
export async function fetchHistory() {
  try {
    const response = await apiClient.get('/history');
    const items = response.data?.data || response.data || [];
    // Update local cache with latest from backend
    if (Array.isArray(items)) {
      setLocalCache(items);
      return { items, syncedWithBackend: true };
    }
    return { items: getLocalCache(), syncedWithBackend: false };
  } catch (error) {
    // If backend is offline or history endpoint not yet implemented, return local cache
    const cachedItems = getLocalCache();
    return {
      items: cachedItems,
      syncedWithBackend: false,
      error: error.isNetworkError
        ? 'Backend offline: Showing locally cached history.'
        : error.message,
    };
  }
}

/**
 * Save a summary to history (MongoDB backend + local cache fallback)
 * @param {Object} summaryItem
 * @returns {Promise<{ item: Object, syncedWithBackend: boolean }>}
 */
export async function saveHistoryItem(summaryItem) {
  const itemToSave = {
    id: summaryItem.id || `hist_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title: summaryItem.title || 'Summary',
    summary: summaryItem.summary,
    originalText: summaryItem.originalText || '',
    length: summaryItem.length || 'medium',
    originalWordCount: summaryItem.originalWordCount || 0,
    summaryWordCount: summaryItem.summaryWordCount || 0,
    createdAt: summaryItem.createdAt || new Date().toISOString(),
  };

  // Always update local cache immediately for responsive UX
  const currentList = getLocalCache();
  const updatedList = [itemToSave, ...currentList.filter((i) => i.id !== itemToSave.id)];
  setLocalCache(updatedList);

  try {
    const response = await apiClient.post('/history', itemToSave);
    const backendItem = response.data?.data || response.data || itemToSave;
    return { item: backendItem, syncedWithBackend: true };
  } catch (error) {
    // Stored locally; backend will sync later
    return { item: itemToSave, syncedWithBackend: false, error: error.message };
  }
}

/**
 * Delete a specific summary item
 * @param {string} id
 * @returns {Promise<{ success: boolean, syncedWithBackend: boolean }>}
 */
export async function deleteHistoryItem(id) {
  const currentList = getLocalCache();
  const updatedList = currentList.filter((item) => (item.id !== id && item._id !== id));
  setLocalCache(updatedList);

  try {
    await apiClient.delete(`/history/${id}`);
    return { success: true, syncedWithBackend: true };
  } catch (error) {
    return { success: true, syncedWithBackend: false };
  }
}

/**
 * Clear all history
 * @returns {Promise<{ success: boolean, syncedWithBackend: boolean }>}
 */
export async function clearAllHistory() {
  setLocalCache([]);

  try {
    await apiClient.delete('/history');
    return { success: true, syncedWithBackend: true };
  } catch (error) {
    return { success: true, syncedWithBackend: false };
  }
}
