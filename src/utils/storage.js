/**
 * Safe localStorage wrapper with error handling and fallback support.
 */

const STORAGE_PREFIX = 'studenthub_';

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clearAll: () => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing StudentHub storage:', error);
      return false;
    }
  },
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
