import { useState, useEffect, useCallback } from 'react';
import * as React from 'react';
import { 
  getTokenInfo,  
  retrieveTokenInfo, 
  clearTokenInfo, 
  autoRefreshTokenIfNeeded,
  setupTokenRefresh,
  formatTimeUntilExpiry,
  TokenInfo
} from '@/lib/token-manager';
import { refreshTokenAPI } from '@/lib/auth';

interface UseTokenManagerResult {
  tokenInfo: TokenInfo | null;
  isLoading: boolean;
  error: string | null;
  refreshTokens: () => Promise<void>;
  logout: () => void;
  formattedTimeUntilExpiry: string;
}

/**
 * Hook for managing authentication tokens
 */
export function useTokenManager(): UseTokenManagerResult {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize token info from storage
  useEffect(() => {
    const initializeTokenInfo = () => {
      try {
        const { token, expiresIn } = retrieveTokenInfo();
        
        if (token && expiresIn) {
          const info = getTokenInfo(token, expiresIn);
          setTokenInfo(info);
          
          // Check if token needs immediate refresh
          if (info.needsRefresh) {
            autoRefreshTokenIfNeeded(token, expiresIn, async (token) => {
              const response = await refreshTokenAPI(token);
              return {
                token: response.data.token,
                expiresIn: response.data.expiresIn
              };
            })
              .then((newTokenInfo) => {
                if (newTokenInfo) {
                  const updatedInfo = getTokenInfo(newTokenInfo.token, newTokenInfo.expiresIn);
                  setTokenInfo(updatedInfo);
                }
              })
              .catch((err) => {
                console.error('Failed to refresh token on init:', err);
                setError('Failed to refresh authentication token');
              });
          }
        }
      } catch (err) {
        console.error('Error initializing token info:', err);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTokenInfo();
  }, []);

  // Setup automatic token refresh
  useEffect(() => {
    const clearRefreshInterval = setupTokenRefresh(60000, async (token) => {
      const response = await refreshTokenAPI(token);
      return {
        token: response.data.token,
        expiresIn: response.data.expiresIn
      };
    });
    
    return () => {
      clearRefreshInterval();
    };
  }, []);

  // Function to manually refresh tokens
  const refreshTokens = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { token, expiresIn } = retrieveTokenInfo();
      
      if (!token || !expiresIn) {
        throw new Error('No token available for refresh');
      }
      
      const newTokenInfo = await autoRefreshTokenIfNeeded(token, expiresIn, async (token) => {
        const response = await refreshTokenAPI(token);
        return {
          token: response.data.token,
          expiresIn: response.data.expiresIn
        };
      });
      
      if (newTokenInfo) {
        const updatedInfo = getTokenInfo(newTokenInfo.token, newTokenInfo.expiresIn);
        setTokenInfo(updatedInfo);
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (err) {
      console.error('Error refreshing tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh tokens');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to logout (clear tokens)
  const logout = useCallback(() => {
    clearTokenInfo();
    setTokenInfo(null);
    setError(null);
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  // Format time until expiry for display
  const formattedTimeUntilExpiry = tokenInfo 
    ? formatTimeUntilExpiry(tokenInfo.timeUntilExpiry)
    : 'No token';

  return {
    tokenInfo,
    isLoading,
    error,
    refreshTokens,
    logout,
    formattedTimeUntilExpiry,
  };
}

/**
 * Higher-order component for protecting routes that require authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  fallbackUrl: string = '/login'
) {
  return function AuthenticatedComponent(props: P) {
    const { tokenInfo, isLoading } = useTokenManager();
    
    useEffect(() => {
      if (!isLoading && (!tokenInfo || !tokenInfo.isValid)) {
        if (typeof window !== 'undefined') {
          window.location.href = fallbackUrl;
        }
      }
    }, [tokenInfo, isLoading]);
    
    if (isLoading) {
      return React.createElement('div', null, 'Loading authentication...');
    }
    
    if (!tokenInfo || !tokenInfo.isValid) {
      return React.createElement('div', null, 'Redirecting to login...');
    }
    
    return React.createElement(Component, { ...props });
  };
}
