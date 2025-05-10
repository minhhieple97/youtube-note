/**
 * Helper functions for working with Chrome storage
 */

/**
 * Get data from Chrome local storage
 * @param key - Storage key
 * @returns Promise resolving to the stored data
 */
export const getFromStorage = async <T>(key: string): Promise<T | undefined> => {
  try {
    const result = await chrome.storage.local.get([key]);
    return result[key] as T;
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return undefined;
  }
};

/**
 * Save data to Chrome local storage
 * @param key - Storage key
 * @param data - Data to store
 * @returns Promise resolving when data is stored
 */
export const saveToStorage = async <T>(key: string, data: T): Promise<void> => {
  try {
    await chrome.storage.local.set({ [key]: data });
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    throw error;
  }
};

/**
 * Remove data from Chrome local storage
 * @param key - Storage key to remove
 * @returns Promise resolving when data is removed
 */
export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await chrome.storage.local.remove(key);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    throw error;
  }
};
