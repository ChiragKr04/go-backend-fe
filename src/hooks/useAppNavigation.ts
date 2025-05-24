import { useNavigate } from "react-router-dom";
import { ROUTES, type RoutePath } from "../routes";

/**
 * Custom hook for type-safe navigation throughout the app
 * Provides convenient methods for common navigation patterns
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = (route: RoutePath) => {
    navigate(route);
  };

  const goToHome = () => navigate(ROUTES.HOME);
  const goToLogin = () => navigate(ROUTES.LOGIN);
  const goToSignup = () => navigate(ROUTES.SIGNUP);
  const goToDashboard = () => navigate(ROUTES.DASHBOARD);
  const goToProfile = () => navigate(ROUTES.PROFILE);

  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);

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
