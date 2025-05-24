# Authentication Setup with Redux

This document explains the Redux-based authentication system implemented in the application.

## Overview

The authentication system provides:

- JWT token-based authentication
- Persistent login state using localStorage
- Easy API integration with automatic token handling
- Type-safe Redux store with TypeScript
- Maintainable configuration with centralized constants

## Architecture

### Files Structure

```
src/
├── constants/
│   └── api.ts                 # API endpoints and constants
├── types/
│   └── auth.ts               # TypeScript interfaces
├── utils/
│   ├── storage.ts            # localStorage utilities
│   └── api.ts                # API request utilities
├── store/
│   ├── index.ts              # Redux store configuration
│   └── slices/
│       └── authSlice.ts      # Authentication Redux slice
├── hooks/
│   └── useAuth.ts            # Custom auth hook
├── components/
│   └── AuthProvider.tsx      # Auth initialization component
└── examples/
    └── AuthenticatedApiExample.tsx  # Usage examples
```

## Configuration

### API Endpoints

Centralized in `src/constants/api.ts`:

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/login`,
    LOGOUT: `${API_BASE_URL}/logout`,
    REFRESH: `${API_BASE_URL}/refresh`,
  },
};
```

To change endpoints, simply update this file.

## Usage

### 1. Login

```typescript
import { useAuth } from "../hooks/useAuth";

const LoginComponent = () => {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      // Login successful - user will be redirected automatically
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
};
```

### 2. Accessing Auth State

```typescript
import { useAuth } from "../hooks/useAuth";

const MyComponent = () => {
  const { user, token, isAuthenticated, isLoading, error } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.first_name}!</h1>
      <p>Your email: {user.email}</p>
    </div>
  );
};
```

### 3. Making Authenticated API Calls

```typescript
import { api } from "../utils/api";

// GET request with automatic auth token
const fetchUserData = async () => {
  try {
    const data = await api.get("/api/v1/user/profile");
    return data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

// POST request with automatic auth token
const updateProfile = async (profileData) => {
  try {
    const response = await api.post("/api/v1/user/profile", profileData);
    return response;
  } catch (error) {
    console.error("Failed to update profile:", error);
  }
};

// Request without auth token
const publicData = await api.get("/api/v1/public/data", false);
```

### 4. Logout

```typescript
import { useAuth } from "../hooks/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // User will be logged out and token cleared from storage
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

## Redux Store Structure

The auth state structure:

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Available Actions

- `loginUser(credentials)` - Async thunk for login
- `logoutUser()` - Async thunk for logout
- `clearError()` - Clear error state
- `clearAuth()` - Clear all auth state
- `setAuthFromStorage()` - Initialize from localStorage

## Storage

The system uses localStorage to persist:

- Authentication token (`auth_token`)
- User data (`user_data`)

Storage utilities are available in `src/utils/storage.ts`:

```typescript
import { authStorage } from "../utils/storage";

// Get token
const token = authStorage.getToken();

// Store user data
authStorage.setUserData(userData);

// Clear all auth data
authStorage.clearAuthData();
```

## Error Handling

The system handles various error scenarios:

- Network errors
- API errors with status codes
- Token expiration
- Invalid credentials

Errors are stored in the Redux state and can be accessed via the `useAuth` hook.

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage for persistence
2. **Automatic Token Inclusion**: The API utility automatically includes tokens in requests
3. **Error Handling**: Proper error handling for expired or invalid tokens
4. **Type Safety**: Full TypeScript support for type safety

## Adding New API Endpoints

1. Add endpoint to `src/constants/api.ts`:

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    /* existing */
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    SETTINGS: `${API_BASE_URL}/user/settings`,
  },
};
```

2. Use in components:

```typescript
import { API_ENDPOINTS } from "../constants/api";
import { api } from "../utils/api";

const data = await api.get(API_ENDPOINTS.USER.PROFILE);
```

## Testing

The authentication system can be tested by:

1. Testing login with valid credentials
2. Testing protected route access
3. Testing API calls with authentication
4. Testing logout functionality
5. Testing persistence across page refreshes

## Example Implementation

See `src/examples/AuthenticatedApiExample.tsx` for a complete example of using the authentication system.
