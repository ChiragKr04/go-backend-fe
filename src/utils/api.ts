import { authStorage } from "./storage";

export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Generic API request function with automatic auth token handling
export const apiRequest = async <T>(
  url: string,
  config: ApiRequestConfig = {}
): Promise<T> => {
  const { method = "GET", headers = {}, body, requiresAuth = true } = config;

  // Set default headers (avoid Content-Type to prevent preflight)
  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  // Add auth token if required and available
  if (requiresAuth) {
    const token = authStorage.getToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body for non-GET requests
  if (body && method !== "GET") {
    requestOptions.body =
      typeof body === "string" ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error"
    );
  }
};

// Convenience methods for different HTTP methods
export const api = {
  get: <T>(url: string, requiresAuth = true): Promise<T> =>
    apiRequest<T>(url, { method: "GET", requiresAuth }),

  post: <T>(url: string, body?: any, requiresAuth = true): Promise<T> =>
    apiRequest<T>(url, { method: "POST", body, requiresAuth }),

  put: <T>(url: string, body?: any, requiresAuth = true): Promise<T> =>
    apiRequest<T>(url, { method: "PUT", body, requiresAuth }),

  patch: <T>(url: string, body?: any, requiresAuth = true): Promise<T> =>
    apiRequest<T>(url, { method: "PATCH", body, requiresAuth }),

  delete: <T>(url: string, requiresAuth = true): Promise<T> =>
    apiRequest<T>(url, { method: "DELETE", requiresAuth }),
};
