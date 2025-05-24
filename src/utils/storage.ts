import { STORAGE_KEYS } from "../constants/api";

// Generic storage utilities
export const storage = {
  // Get item from localStorage
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item from localStorage:`, error);
      return null;
    }
  },

  // Set item in localStorage
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item in localStorage:`, error);
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage:`, error);
    }
  },

  // Clear all localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  },
};

// Auth-specific storage utilities
export const authStorage = {
  // Get auth token
  getToken: (): string | null => {
    return storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Set auth token
  setToken: (token: string): void => {
    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  // Remove auth token
  removeToken: (): void => {
    storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Get user data
  getUserData: (): any | null => {
    const userData = storage.getItem(STORAGE_KEYS.USER_DATA);
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  },

  // Set user data
  setUserData: (userData: any): void => {
    try {
      storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data in localStorage:", error);
    }
  },

  // Remove user data
  removeUserData: (): void => {
    storage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Clear all auth data
  clearAuthData: (): void => {
    authStorage.removeToken();
    authStorage.removeUserData();
  },
};
