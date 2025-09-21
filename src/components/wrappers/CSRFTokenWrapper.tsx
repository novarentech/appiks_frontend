"use client";

import { useEffect, useState } from "react";
import { useCSRFToken } from "@/hooks/useCSRFToken";

interface CSRFTokenWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function CSRFTokenWrapper({ children, fallback }: CSRFTokenWrapperProps) {
  const { csrfToken, loading, error, refreshToken } = useCSRFToken();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading && csrfToken) {
      setIsReady(true);
    }
  }, [loading, csrfToken]);

  useEffect(() => {
    if (error && !loading) {
      console.error("CSRF token error:", error);
      // Try to refresh token on error
      const timer = setTimeout(() => {
        refreshToken();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error, loading, refreshToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Initializing security...</p>
        </div>
      </div>
    );
  }

  if (error && !csrfToken) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Security Error</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Failed to initialize security token. Please refresh the page.
          </p>
          <button
            onClick={refreshToken}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return fallback || null;
  }

  return <>{children}</>;
}