"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SafetyCheckContextType {
  isDialogOpen: boolean;
  currentStep: number;
  openDialog: () => void;
  closeDialog: () => void;
  nextStep: () => void;
  prevStep: () => void;
  hasCheckedSafetyToday: () => boolean;
  markSafetyCheckCompleted: () => void;
}

const SafetyCheckContext = createContext<SafetyCheckContextType | undefined>(undefined);

export function SafetyCheckProvider({ children }: { children: ReactNode }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const openDialog = () => {
    setIsDialogOpen(true);
    setCurrentStep(1); // Reset ke step pertama setiap kali dialog dibuka
  };
  
  const closeDialog = () => setIsDialogOpen(false);
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  // Cek apakah user sudah melakukan pengecekan keamanan hari ini
  const hasCheckedSafetyToday = (): boolean => {
    try {
      const today = new Date().toDateString();
      const lastCheckDate = localStorage.getItem("safetyCheckLastDate");
      return lastCheckDate === today;
    } catch (error) {
      console.error("Error checking safety check status:", error);
      return false;
    }
  };

  // Tandai bahwa user sudah melakukan pengecekan keamanan hari ini
  const markSafetyCheckCompleted = () => {
    try {
      const today = new Date().toDateString();
      localStorage.setItem("safetyCheckLastDate", today);
    } catch (error) {
      console.error("Error marking safety check completed:", error);
    }
  };

  return (
    <SafetyCheckContext.Provider
      value={{
        isDialogOpen,
        currentStep,
        openDialog,
        closeDialog,
        nextStep,
        prevStep,
        hasCheckedSafetyToday,
        markSafetyCheckCompleted,
      }}
    >
      {children}
    </SafetyCheckContext.Provider>
  );
}

export function useSafetyCheck() {
  const context = useContext(SafetyCheckContext);
  if (context === undefined) {
    throw new Error("useSafetyCheck must be used within a SafetyCheckProvider");
  }
  return context;
}