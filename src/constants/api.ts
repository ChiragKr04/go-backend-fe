// API Base URL
export const API_BASE_URL = "http://localhost:3000/api/v1";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/login`,
    REGISTER: `${API_BASE_URL}/register`,
    LOGOUT: `${API_BASE_URL}/logout`,
    REFRESH: `${API_BASE_URL}/refresh`,
  },
  USER: {
    GET_PROFILE: (userId: string) => `${API_BASE_URL}/get-profile/${userId}`,
  },
  // Add more API endpoints here as needed
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
} as const;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: "success",
  ERROR: "error",
  UNAUTHORIZED: "unauthorized",
} as const;
