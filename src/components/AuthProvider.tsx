import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authStorage } from '../utils/storage';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { verifyToken, initializeAuth } = useAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeAuthState = async () => {
      // Prevent duplicate initialization
      if (hasInitialized.current) {
        console.log('AuthProvider - Already initialized, skipping...');
        return;
      }

      console.log('AuthProvider - Starting initialization...');
      hasInitialized.current = true;

      // First, restore auth state from localStorage
      initializeAuth();

      // Check if we have a token in storage
      const token = authStorage.getToken();
      const userData = authStorage.getUserData();

      console.log('AuthProvider - Storage data:', {
        hasToken: !!token,
        hasUserData: !!userData,
        userData: userData
      });

      if (token && userData) {
        // Try to verify token, but don't redirect on failure
        // The user can still use the app with cached data
        try {
          console.log('AuthProvider - Attempting token verification...');
          const result = await verifyToken();
          console.log('AuthProvider - Token verification result:', result);
        } catch (error) {
          console.warn('AuthProvider - Token verification failed, using cached user data:', error);
          // Don't redirect to login here - let the user continue with cached data
          // The token might be temporarily unavailable due to network issues
        }
      } else {
        console.log('AuthProvider - No token or user data found in storage');
      }
      // If no token/userData, user will naturally land on public routes
    };

    initializeAuthState();
  }, [verifyToken, initializeAuth]);

  return <>{children}</>;
};

export default AuthProvider; 