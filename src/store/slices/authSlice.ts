import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ApiError,
  User,
} from "../../types/auth";
import { API_ENDPOINTS } from "../../constants/api";
import { authStorage } from "../../utils/storage";
import { debugAuth } from "../../utils/authDebug";

// Track verifyToken calls
let verifyTokenCallCount = 0;

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
      headers: {
        "Content-Type": "application/json",
      },
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

// Async thunk for signup
export const signupUser = createAsyncThunk<
  SignupResponse,
  SignupRequest,
  { rejectValue: ApiError }
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue({
        message: data.message || "Signup failed",
        status: response.status,
      });
    }

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

// Async thunk for token verification and profile fetch
export const verifyToken = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: ApiError }
>("auth/verifyToken", async (_, { rejectWithValue }) => {
  try {
    verifyTokenCallCount++;
    console.log(
      `🔐 verifyToken called #${verifyTokenCallCount} at:`,
      new Date().toISOString()
    );
    debugAuth.logStorageState();

    const token = authStorage.getToken();
    const userData = authStorage.getUserData();

    console.log("🔍 Raw userData from storage:", userData);

    // Handle case where userData might be the entire login response
    let actualUser = userData;
    if (userData && userData.user && userData.message) {
      // userData contains the entire login response, extract the user
      console.log("⚠️ userData contains full response, extracting user object");
      actualUser = userData.user;
    }

    console.log("🔍 Actual user object:", actualUser);

    if (!token || !actualUser?.id) {
      console.log("❌ No token or user data found", {
        hasToken: !!token,
        hasUserData: !!userData,
        hasActualUser: !!actualUser,
        actualUserId: actualUser?.id,
      });
      return rejectWithValue({
        message: "No token or user data found",
        status: 401,
      });
    }

    const endpoint = API_ENDPOINTS.USER.GET_PROFILE(actualUser.id.toString());
    console.log("📡 Making API call to:", endpoint);
    debugAuth.logApiCall("GET_PROFILE", endpoint);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📡 API Response status:", response.status);

    if (!response.ok) {
      debugAuth.logApiCall("GET_PROFILE", endpoint, false);

      let responseText = "";
      try {
        responseText = await response.text();
        console.log("📡 API Response body:", responseText);
      } catch (e) {
        console.log("📡 Could not read response body");
      }

      // Only clear auth data for authentication-related errors (401, 403)
      // For other errors (500, network issues), keep the cached data
      if (response.status === 401 || response.status === 403) {
        console.log("🚫 Token invalid, clearing auth data");
        authStorage.clearAuthData();
        return rejectWithValue({
          message: "Token expired or invalid",
          status: response.status,
        });
      } else {
        console.log(
          "⚠️ API error but keeping auth data, status:",
          response.status
        );
        // For other errors, don't clear auth data - just return error
        return rejectWithValue({
          message: "Failed to verify token",
          status: response.status,
        });
      }
    }

    const data = await response.json();
    console.log("✅ Token verification API response:", {
      fullResponse: data,
      dataType: typeof data,
      dataKeys: Object.keys(data),
      hasUser: !!data.user,
      hasUsername: !!data.username,
      username: data.username,
      userObject: data.user,
      directUserFields: {
        id: data.id,
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
      },
    });

    // Determine what to store - if response has user field, use that, otherwise use the response directly
    let userToStore = data;
    if (data.user) {
      console.log("📦 API response contains user object, extracting it");
      userToStore = data.user;
    } else if (data.id) {
      console.log("📦 API response is the user object directly");
      userToStore = data;
    } else {
      console.log("⚠️ API response has unexpected structure");
    }

    console.log("💾 Storing user data:", userToStore);

    // Update stored user data with fresh data from API
    authStorage.setUserData(userToStore);

    return { user: userToStore };
  } catch (error) {
    console.log("💥 Token verification network error:", error);
    debugAuth.logApiCall("GET_PROFILE", "unknown", false);

    // For network errors, don't clear auth data - user can continue with cached data
    return rejectWithValue({
      message: error instanceof Error ? error.message : "Network error",
    });
  }
});

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
      const userData = authStorage.getUserData();

      console.log("🔄 setAuthFromStorage called:", {
        hasToken: !!token,
        hasUser: !!userData,
        userData: userData,
        userType: typeof userData,
        userKeys: userData ? Object.keys(userData) : null,
      });

      if (token && userData) {
        // Clean up userData if it's in the wrong format
        let cleanUser = userData;
        if (userData.user && userData.message) {
          console.log("🧹 Cleaning up bad data format in localStorage");
          cleanUser = userData.user;
          // Store the cleaned data
          authStorage.setUserData(cleanUser);
        }

        state.token = token;
        state.user = cleanUser;
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
          console.log("🔄 Login successful, storing user data:", {
            fullResponse: action.payload,
            userObject: action.payload.user,
            token: action.payload.token,
          });

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
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Don't set user/token for signup, just clear loading state
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Signup failed";
      })
      // Token verification cases
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = authStorage.getToken();
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Token verification failed";

        // Only clear auth state for actual authentication errors (401/403)
        // For other errors (network, server errors), keep user logged in with cached data
        if (action.payload?.status === 401 || action.payload?.status === 403) {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
        // For other errors, keep the user authenticated with cached data
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
