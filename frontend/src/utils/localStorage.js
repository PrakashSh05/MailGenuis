export const localStore = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      localStorage.setItem(key, stringValue);
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  }
};
