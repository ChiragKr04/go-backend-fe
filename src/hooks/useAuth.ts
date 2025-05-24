import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import type { RootState, AppDispatch } from "../store";
import {
  loginUser,
  logoutUser,
  clearError,
  clearAuth,
  setAuthFromStorage,
} from "../store/slices/authSlice";
import type { LoginRequest } from "../types/auth";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (credentials: LoginRequest) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearAuthState = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  const initializeAuthFromStorage = useCallback(() => {
    dispatch(setAuthFromStorage());
  }, [dispatch]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    logout,
    clearError: clearAuthError,
    clearAuth: clearAuthState,
    initializeAuth: initializeAuthFromStorage,
  };
};
