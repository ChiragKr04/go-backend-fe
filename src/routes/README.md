# Routing System Documentation

This directory contains the centralized routing configuration for the CodeHall application.

## 📁 File Structure

```
src/routes/
├── index.ts          # Main routes configuration
└── README.md         # This documentation
```

## 🎯 Purpose

The centralized routing system provides:

- **Single source of truth** for all application routes
- **Type safety** with TypeScript
- **Easy maintenance** - change routes in one place
- **Future extensibility** with route metadata

## 📋 Usage

### Basic Route Usage

```typescript
import { ROUTES } from "../routes";
import { useNavigate } from "react-router-dom";

// In your component
const navigate = useNavigate();
navigate(ROUTES.LOGIN); // Type-safe navigation
```

### Using the Custom Navigation Hook

```typescript
import { useAppNavigation } from "../hooks/useAppNavigation";

// In your component
const { goToLogin, goToHome, navigateTo } = useAppNavigation();

// Direct methods
goToLogin();
goToHome();

// Generic navigation
navigateTo(ROUTES.DASHBOARD);
```

### Route Configuration in App.tsx

```typescript
import { ROUTES } from "./routes";

<Routes>
  <Route path={ROUTES.HOME} element={<Landing />} />
  <Route path={ROUTES.LOGIN} element={<Login />} />
</Routes>;
```

## 🔧 Adding New Routes

1. **Add the route path** to the `ROUTES` object in `index.ts`:

```typescript
export const ROUTES = {
  // ... existing routes
  NEW_PAGE: "/new-page",
} as const;
```

2. **Add route configuration** (optional):

```typescript
export const ROUTE_CONFIG = {
  // ... existing configs
  [ROUTES.NEW_PAGE]: {
    title: "New Page - CodeHall",
    description: "Description of the new page",
    requiresAuth: true, // or false
  },
} as const;
```

3. **Add navigation method** to `useAppNavigation.ts`:

```typescript
const goToNewPage = () => navigate(ROUTES.NEW_PAGE);

return {
  // ... existing methods
  goToNewPage,
};
```

4. **Add the route** to `App.tsx`:

```typescript
<Route path={ROUTES.NEW_PAGE} element={<NewPage />} />
```

## 🛡️ Type Safety

The system provides full TypeScript support:

- `RoutePath` type for all valid route paths
- `RouteKey` type for route keys
- Compile-time checking for route usage

## 🎨 Best Practices

1. **Always use route constants** instead of hardcoded strings
2. **Use the custom navigation hook** for cleaner component code
3. **Update route metadata** when adding new routes
4. **Keep route names descriptive** and consistent with your naming convention

## 🔮 Future Enhancements

The route configuration supports:

- **Authentication requirements** (`requiresAuth`)
- **Page titles and descriptions** for SEO
- **Route groups** and **nested routing**
- **Route guards** and **middleware**

## 📝 Examples

### Before (Hardcoded Routes)

```typescript
// ❌ Hard to maintain
navigate('/login')
navigate('/dashboard/profile')
<Route path="/login" element={<Login />} />
```

### After (Centralized Routes)

```typescript
// ✅ Easy to maintain
navigate(ROUTES.LOGIN)
navigateTo(ROUTES.PROFILE)
<Route path={ROUTES.LOGIN} element={<Login />} />
```

## 🚀 Quick Reference

| Route              | Path         | Description           |
| ------------------ | ------------ | --------------------- |
| `ROUTES.HOME`      | `/`          | Landing page          |
| `ROUTES.LOGIN`     | `/login`     | Login page            |
| `ROUTES.SIGNUP`    | `/signup`    | Sign up page (future) |
| `ROUTES.DASHBOARD` | `/dashboard` | User dashboard        |
| `ROUTES.PROFILE`   | `/profile`   | User profile (future) |
