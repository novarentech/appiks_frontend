"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Hook untuk mencegah user yang sudah verified mengakses halaman fill-data
 * Akan redirect user yang sudah verified ke dashboard
 */
export function useVerificationRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Skip redirect jika session masih loading
    if (status === "loading") return;

    // Redirect ke login jika tidak ada session
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Redirect ke dashboard jika user sudah verified
    if (session?.user?.verified === true) {
      console.log("🔄 User already verified, redirecting to dashboard...");
      router.push("/dashboard");
      return;
    }

    // Log status untuk debugging
    console.log("📋 User verification status:", {
      verified: session?.user?.verified,
      username: session?.user?.username,
      canAccessFillData: Boolean(session?.user?.verified) !== true,
    });
  }, [session, status, router]);

  // Return status untuk komponen yang ingin menampilkan loading state
  return {
    isLoading: status === "loading",
    isVerified: Boolean(session?.user?.verified) === true,
    canAccessFillData:
      status === "authenticated" && Boolean(session?.user?.verified) !== true,
  };
}
