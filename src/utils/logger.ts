// Production-safe logging utility
const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  trace: (...args: any[]) => {
    if (isDevelopment) {
      console.trace(...args);
    }
  },
};

// For development debugging only
export const devLog = {
  auth: (...args: any[]) => {
    if (isDevelopment) {
      console.log("🔐 [AUTH]", ...args);
    }
  },

  api: (...args: any[]) => {
    if (isDevelopment) {
      console.log("📡 [API]", ...args);
    }
  },

  storage: (...args: any[]) => {
    if (isDevelopment) {
      console.log("💾 [STORAGE]", ...args);
    }
  },

  state: (...args: any[]) => {
    if (isDevelopment) {
      console.log("🔄 [STATE]", ...args);
    }
  },
};
