export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ApiError {
  message: string;
  status?: number;
}
