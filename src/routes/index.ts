// Route paths - centralized route management
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup", // For future use
  DASHBOARD: "/dashboard",
  PROFILE: "/profile", // For future use
  ROOM: "/room/:roomId", // Room page
} as const;

// Route configurations with metadata (for future enhancements)
export const ROUTE_CONFIG = {
  [ROUTES.HOME]: {
    title: "CodeHall - Code together, anywhere",
    description: "Collaborative coding platform",
    requiresAuth: false,
  },
  [ROUTES.LOGIN]: {
    title: "Login - CodeHall",
    description: "Sign in to your CodeHall account",
    requiresAuth: false,
  },
  [ROUTES.SIGNUP]: {
    title: "Sign Up - CodeHall",
    description: "Create your CodeHall account",
    requiresAuth: false,
  },
  [ROUTES.DASHBOARD]: {
    title: "Dashboard - CodeHall",
    description: "Your coding workspace",
    requiresAuth: true,
  },
  [ROUTES.PROFILE]: {
    title: "Profile - CodeHall",
    description: "Manage your profile",
    requiresAuth: true,
  },
  [ROUTES.ROOM]: {
    title: "Room - CodeHall",
    description: "Collaborative coding room",
    requiresAuth: true,
  },
} as const;

// Type for route paths
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
