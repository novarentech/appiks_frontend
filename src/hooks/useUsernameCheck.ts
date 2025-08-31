"use client";

import { useState, useCallback } from "react";
import type { CheckUsernameResponse } from "@/types/auth";

interface UseUsernameCheckReturn {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
  checkUsername: (username: string) => Promise<boolean>;
  clearCheck: () => void;
}

export function useUsernameCheck(): UseUsernameCheckReturn {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkUsername = useCallback(
    async (username: string): Promise<boolean> => {
      if (!username || username.trim().length < 3) {
        setError("Username minimal 3 karakter");
        setIsAvailable(null);
        return false;
      }

      setIsChecking(true);
      setError(null);
      setIsAvailable(null);

      try {
        console.log("🔍 Checking username:", username);

        const response = await fetch(
          `/api/check-username?username=${encodeURIComponent(username.trim())}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CheckUsernameResponse = await response.json();

        if (data.success) {
          // data.username: true = username tersedia, false = sudah digunakan
          const available = data.data.username;
          setIsAvailable(available);

          if (!available) {
            setError("Username sudah digunakan");
          }

          console.log("✅ Username check result:", { username, available });
          return available;
        } else {
          setError(data.message || "Gagal mengecek username");
          return false;
        }
      } catch (error) {
        console.error("❌ Username check error:", error);
        setError("Terjadi kesalahan saat mengecek username");
        return false;
      } finally {
        setIsChecking(false);
      }
    },
    []
  );

  const clearCheck = useCallback(() => {
    setIsAvailable(null);
    setError(null);
    setIsChecking(false);
  }, []);

  return {
    isChecking,
    isAvailable,
    error,
    checkUsername,
    clearCheck,
  };
}
