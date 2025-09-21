// Centralized configuration for API URLs and other constants

// API Base URLs
export const API_BASE_URL = process.env.API_BASE_URL;

// Auth Configuration
export const JWT_SECRET = process.env.JWT_SECRET;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

// Token Configuration
export const TOKEN_REFRESH_THRESHOLD_MINUTES = parseInt(process.env.TOKEN_REFRESH_THRESHOLD_MINUTES as string, 10);
export const TOKEN_MAX_AGE_SECONDS = parseInt(process.env.TOKEN_MAX_AGE_SECONDS as string, 10);

// CSRF Configuration
export const CSRF_SECRET = process.env.CSRF_SECRET;

// Other Configuration
export const NODE_ENV = process.env.NODE_ENV;