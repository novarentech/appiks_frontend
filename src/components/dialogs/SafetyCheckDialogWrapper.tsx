"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { SafetyCheckDialog } from "./SafetyCheckDialog";
import { useSafetyCheck } from "@/contexts/SafetyCheckContext";
import { useMoodRecordToday } from "@/hooks/useMoodRecordToday";

interface SafetyCheckDialogWrapperProps {
  children: React.ReactNode;
}

// Daftar path yang tidak perlu pengecekan keamanan
const EXCLUDED_PATHS = [
  "/login",
  "/fill-data",
  "/checkin",
  "/survey",
  "/survey-result",
  "/api",
  "/self-help/share-thing", // Tambahkan path ini agar tidak muncul dialog saat sudah di redirect
];

export function SafetyCheckDialogWrapper({ children }: SafetyCheckDialogWrapperProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { data: moodRecord, loading } = useMoodRecordToday();
  const { 
    openDialog, 
    hasCheckedSafetyToday 
  } = useSafetyCheck();

  useEffect(() => {
    // Skip jika:
    // 1. Session belum dimuat
    // 2. User belum login
    // 3. Path termasuk dalam daftar pengecualian
    // 4. User bukan student
    // 5. Data mood sedang loading
    // 6. User sudah melakukan pengecekan keamanan hari ini
    if (
      !session ||
      EXCLUDED_PATHS.some(path => pathname.startsWith(path)) ||
      session.user?.role !== "student" ||
      loading ||
      hasCheckedSafetyToday()
    ) {
      return;
    }

    // Cek apakah mood status adalah "insecure" (tidak aman)
    if (moodRecord?.status === "insecure") {
      // Tunggu sebentar sebelum menampilkan dialog
      // agar user punya waktu untuk melihat halaman terlebih dahulu
      const timer = setTimeout(() => {
        openDialog();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [
    session,
    pathname,
    moodRecord,
    loading,
    hasCheckedSafetyToday,
    openDialog,
  ]);

  return (
    <>
      {children}
      <SafetyCheckDialog />
    </>
  );
}