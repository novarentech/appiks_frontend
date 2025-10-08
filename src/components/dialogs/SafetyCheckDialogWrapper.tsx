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

export function SafetyCheckDialogWrapper({ children }: SafetyCheckDialogWrapperProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { data: moodRecord, loading } = useMoodRecordToday();
  const { 
    openDialog, 
    hasCheckedSafetyToday 
  } = useSafetyCheck();

  useEffect(() => {
    if (
      !session ||
      session.user?.role !== "student" ||
      loading ||
      hasCheckedSafetyToday()
    ) {
      return;
    }

    if (moodRecord?.status === "insecure") {
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