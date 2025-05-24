import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginRequest,
  LoginResponse,
  ApiError,
} from "../../types/auth";
import { API_ENDPOINTS } from "../../constants/api";
import { authStorage } from "../../utils/storage";

// Initial state
const initialState: AuthState = {
  user: authStorage.getUserData(),
  token: authStorage.getToken(),
  isAuthenticated: !!authStorage.getToken(),
  isLoading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: ApiError }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue({
        message: data.message || "Login failed",
        status: response.status,
      });
    }

    // Store token and user data in localStorage
    authStorage.setToken(data.token);
    authStorage.setUserData(data.user);

    return data;
  } catch (error) {
    return rejectWithValue({
      message: error instanceof Error ? error.message : "Network error",
    });
  }
});

// Async thunk for logout
export const logoutUser = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    // Clear stored auth data
    authStorage.clearAuthData();
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear auth state
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      authStorage.clearAuthData();
    },

    // Set auth from stored data (for app initialization)
    setAuthFromStorage: (state) => {
      const token = authStorage.getToken();
      const user = authStorage.getUserData();

      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, clearAuth, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
