"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { UpdateProfileResponse } from "@/types/auth";

interface UpdateProfileData {
  username: string;
  phone: string;
}

export function useProfileUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, update } = useSession();

  const updateProfile = async (
    profileData: UpdateProfileData
  ): Promise<boolean> => {
    if (!session?.user?.token) {
      setError("Token tidak ditemukan");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Updating profile with data:", profileData);

      // Use internal API route instead of direct backend call
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      console.log("📥 API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: UpdateProfileResponse = await response.json();
      console.log("✅ Profile updated successfully:", data);

      if (data.success) {
        // Update session with new data from the response
        console.log("🔄 Updating session with new profile data:", data.data);
        console.log("🔍 Current session before update:", session);

        try {
          const updateResult = await update({
            ...session,
            user: {
              ...session.user,
              username: data.data.username,
              phone: data.data.phone,
              name: data.data.name,
              verified: data.data.verified,
            },
          });

          console.log("🔍 Update result:", updateResult);
          console.log("✅ Session updated successfully");

          // Wait a bit for session to propagate
          await new Promise((resolve) => setTimeout(resolve, 100));

          return true;
        } catch (updateError) {
          console.error("❌ Session update error:", updateError);
          throw new Error("Failed to update session");
        }
      } else {
        throw new Error(data.message || "Profile update failed");
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);

      let errorMessage = "Terjadi kesalahan yang tidak diketahui";
      if (error instanceof Error) {
        if (error.message.includes("422")) {
          errorMessage =
            "Data yang dikirim tidak valid. Periksa format username dan nomor telepon.";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Akses ditolak. Anda mungkin sudah memperbarui profil sebelumnya.";
        } else if (error.message.includes("401")) {
          errorMessage = "Sesi sudah kedaluwarsa. Silakan login kembali.";
        } else if (error.message.includes("500")) {
          errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
  };
}
