"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function useAuthRedirect(redirectTo: string = "/dashboard") {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      window.location.href = redirectTo;
    }
  }, [session, status, redirectTo]);

  return { 
    isAuthenticated: status === "authenticated", 
    isLoading: status === "loading" 
  };
}