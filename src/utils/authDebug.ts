import { authStorage } from "./storage";

// Monitor localStorage changes for auth data
let localStorageWatcher: any = null;

export const debugAuth = {
  logStorageState: () => {
    const token = authStorage.getToken();
    const userData = authStorage.getUserData();

    console.log("🔍 Auth Storage Debug:", {
      timestamp: new Date().toISOString(),
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : null,
      hasUserData: !!userData,
      userData: userData,
      localStorageKeys: Object.keys(localStorage).filter(
        (key) =>
          key.includes("auth") || key.includes("user") || key.includes("token")
      ),
    });
  },

  logApiCall: (type: string, endpoint: string, success: boolean = true) => {
    console.log(`📡 API Call [${type}]:`, {
      timestamp: new Date().toISOString(),
      endpoint,
      success,
      authDataExists: !!authStorage.getToken(),
    });
  },

  logAuthStateChange: (state: any, action: string) => {
    console.log(`🔄 Auth State Change [${action}]:`, {
      timestamp: new Date().toISOString(),
      isAuthenticated: state.isAuthenticated,
      hasUser: !!state.user,
      username: state.user?.username,
      isLoading: state.isLoading,
      error: state.error,
    });
  },

  // Clean up bad auth data format
  cleanupAuthData: () => {
    console.log("🧹 Starting auth data cleanup...");
    const userData = authStorage.getUserData();

    if (userData && userData.user && userData.message) {
      console.log("🔧 Found bad data format, cleaning up:", userData);
      const cleanUser = userData.user;
      authStorage.setUserData(cleanUser);
      console.log("✅ Cleaned user data:", cleanUser);
      return true;
    } else {
      console.log("✅ Auth data format is already correct");
      return false;
    }
  },

  // Monitor localStorage for auth data changes
  startLocalStorageMonitoring: () => {
    if (localStorageWatcher) return; // Already monitoring

    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;

    localStorage.setItem = function (key: string, value: string) {
      if (
        key.includes("auth") ||
        key.includes("user") ||
        key.includes("token")
      ) {
        console.log("📝 localStorage.setItem:", {
          key,
          valuePreview: value.substring(0, 50) + "...",
        });
        console.trace("Set item stack trace");
      }
      return originalSetItem.call(this, key, value);
    };

    localStorage.removeItem = function (key: string) {
      if (
        key.includes("auth") ||
        key.includes("user") ||
        key.includes("token")
      ) {
        console.log("🗑️ localStorage.removeItem:", { key });
        console.trace("Remove item stack trace");
      }
      return originalRemoveItem.call(this, key);
    };

    localStorage.clear = function () {
      console.log("💥 localStorage.clear() called");
      console.trace("Clear localStorage stack trace");
      return originalClear.call(this);
    };

    localStorageWatcher = {
      originalSetItem,
      originalRemoveItem,
      originalClear,
    };
    console.log("👀 Started localStorage monitoring for auth data");
  },

  stopLocalStorageMonitoring: () => {
    if (!localStorageWatcher) return;

    localStorage.setItem = localStorageWatcher.originalSetItem;
    localStorage.removeItem = localStorageWatcher.originalRemoveItem;
    localStorage.clear = localStorageWatcher.originalClear;

    localStorageWatcher = null;
    console.log("🛑 Stopped localStorage monitoring");
  },
};
