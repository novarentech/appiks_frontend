import { useState, useEffect } from 'react';

interface CSRFTokenResponse {
  success: boolean;
  message: string;
  data?: {
    csrfToken: string;
  };
}

export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCSRFToken = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/csrf', {
        method: 'GET',
        credentials: 'include',
      });
      
      const data: CSRFTokenResponse = await response.json();
      
      if (data.success && data.data?.csrfToken) {
        setCSRFToken(data.data.csrfToken);
      } else {
        setError(data.message || 'Failed to fetch CSRF token');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCSRFToken();
  }, []);

  // Function to refresh the token
  const refreshToken = () => {
    return fetchCSRFToken();
  };

  return {
    csrfToken,
    loading,
    error,
    refreshToken,
  };
}