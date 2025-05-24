import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { ROUTES, type RoutePath } from "../routes";

/**
 * Custom hook for type-safe navigation throughout the app
 * Provides convenient methods for common navigation patterns
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = useCallback(
    (route: RoutePath) => {
      navigate(route);
    },
    [navigate]
  );

  const goToHome = useCallback(() => navigate(ROUTES.HOME), [navigate]);
  const goToLogin = useCallback(() => navigate(ROUTES.LOGIN), [navigate]);
  const goToSignup = useCallback(() => navigate(ROUTES.SIGNUP), [navigate]);
  const goToDashboard = useCallback(
    () => navigate(ROUTES.DASHBOARD),
    [navigate]
  );
  const goToProfile = useCallback(() => navigate(ROUTES.PROFILE), [navigate]);

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const goForward = useCallback(() => navigate(1), [navigate]);

  return {
    // Generic navigation
    navigateTo,

    // Specific route navigation
    goToHome,
    goToLogin,
    goToSignup,
    goToDashboard,
    goToProfile,

    // Browser navigation
    goBack,
    goForward,

    // Access to routes for conditional logic
    routes: ROUTES,
  };
};
