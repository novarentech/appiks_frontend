import { decodeJWT, isTokenExpired, shouldRefreshToken } from './auth';
import { JWTPayload } from '@/types/auth';

/**
 * Token information interface
 */
export interface TokenInfo {
  token: string;
  expiresIn: string;
  decoded: JWTPayload | null;
  isValid: boolean;
  needsRefresh: boolean;
  timeUntilExpiry: number;
}

/**
 * Enhanced token validation with detailed information
 */
export function getTokenInfo(token: string, expiresIn: string): TokenInfo {
  if (!token) {
    return {
      token: '',
      expiresIn: '',
      decoded: null,
      isValid: false,
      needsRefresh: true,
      timeUntilExpiry: 0,
    };
  }

  try {
    const decoded = decodeJWT(token);
    const isExpired = isTokenExpired(expiresIn);
    const needsRefresh = shouldRefreshToken(expiresIn);
    
    // Calculate time until expiry in milliseconds
    const expiryDate = new Date(expiresIn);
    const now = new Date();
    const timeUntilExpiry = Math.max(0, expiryDate.getTime() - now.getTime());

    return {
      token,
      expiresIn,
      decoded,
      isValid: !isExpired,
      needsRefresh,
      timeUntilExpiry,
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    return {
      token,
      expiresIn,
      decoded: null,
      isValid: false,
      needsRefresh: true,
      timeUntilExpiry: 0,
    };
  }
}

/**
 * Token storage keys
 */
const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'appiks_access_token',
  EXPIRES_IN: 'appiks_expires_in',
  TOKEN_TIMESTAMP: 'appiks_token_timestamp',
};

/**
 * Store token information in localStorage
 */
export function storeTokenInfo(token: string, expiresIn: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(TOKEN_STORAGE_KEYS.EXPIRES_IN, expiresIn);
    localStorage.setItem(TOKEN_STORAGE_KEYS.TOKEN_TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Error storing token info:', error);
  }
}

/**
 * Retrieve token information from localStorage
 */
export function retrieveTokenInfo(): { token: string | null; expiresIn: string | null } {
  if (typeof window === 'undefined') {
    return { token: null, expiresIn: null };
  }
  
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    const expiresIn = localStorage.getItem(TOKEN_STORAGE_KEYS.EXPIRES_IN);
    
    return { token, expiresIn };
  } catch (error) {
    console.error('Error retrieving token info:', error);
    return { token: null, expiresIn: null };
  }
}

/**
 * Clear token information from localStorage
 */
export function clearTokenInfo(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.EXPIRES_IN);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.TOKEN_TIMESTAMP);
  } catch (error) {
    console.error('Error clearing token info:', error);
  }
}

/**
 * Check if stored token is valid
 */
export function isStoredTokenValid(): boolean {
  const { token, expiresIn } = retrieveTokenInfo();
  
  if (!token || !expiresIn) {
    return false;
  }
  
  const tokenInfo = getTokenInfo(token, expiresIn);
  return tokenInfo.isValid;
}

/**
 * Get stored token if valid
 */
export function getValidStoredToken(): string | null {
  const { token, expiresIn } = retrieveTokenInfo();
  
  if (!token || !expiresIn) {
    return null;
  }
  
  const tokenInfo = getTokenInfo(token, expiresIn);
  return tokenInfo.isValid ? token : null;
}

/**
 * Auto-refresh token if needed
 */
export async function autoRefreshTokenIfNeeded(
  currentToken: string,
  currentExpiresIn: string,
  refreshFunction: (token: string) => Promise<{ token: string; expiresIn: string }>
): Promise<{ token: string; expiresIn: string } | null> {
  const tokenInfo = getTokenInfo(currentToken, currentExpiresIn);
  
  if (!tokenInfo.needsRefresh) {
    return { token: currentToken, expiresIn: currentExpiresIn };
  }
  
  try {
    console.log('Token needs refresh, attempting to refresh...');
    const newTokenInfo = await refreshFunction(currentToken);
    
    if (newTokenInfo.token && newTokenInfo.expiresIn) {
      // Store the new token
      storeTokenInfo(newTokenInfo.token, newTokenInfo.expiresIn);
      console.log('Token refreshed successfully');
      return newTokenInfo;
    }
    
    console.error('Token refresh failed: Invalid response');
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

/**
 * Setup automatic token refresh interval
 */
export function setupTokenRefresh(
  checkInterval: number = 60000, // 1 minute
  refreshFunction: (token: string) => Promise<{ token: string; expiresIn: string }>
): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // Return empty function for server-side
  }
  
  const intervalId = setInterval(async () => {
    const { token, expiresIn } = retrieveTokenInfo();
    
    if (token && expiresIn) {
      const tokenInfo = getTokenInfo(token, expiresIn);
      
      if (tokenInfo.needsRefresh) {
        await autoRefreshTokenIfNeeded(token, expiresIn, refreshFunction);
      }
    }
  }, checkInterval);
  
  // Return function to clear interval
  return () => clearInterval(intervalId);
}

/**
 * Format time until expiry for display
 */
export function formatTimeUntilExpiry(timeUntilExpiry: number): string {
  if (timeUntilExpiry <= 0) {
    return 'Expired';
  }
  
  const minutes = Math.floor(timeUntilExpiry / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  return 'Less than a minute';
}