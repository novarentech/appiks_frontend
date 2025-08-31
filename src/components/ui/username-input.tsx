"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function UsernameInput({
  value,
  onChange,
  label = "Username",
  placeholder = "Masukkan username",
  className,
  disabled = false,
  required = false,
}: UsernameInputProps) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const { isChecking, isAvailable, error, checkUsername, clearCheck } =
    useUsernameCheck();

  // Status indikator
  const getStatusColor = () => {
    if (isChecking) return "text-gray-500";
    if (error) return "text-red-500";
    if (isAvailable === true) return "text-green-500";
    if (isAvailable === false) return "text-red-500";
    return "text-gray-500";
  };

  const getStatusIcon = () => {
    if (isChecking) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (error) return <X className="w-4 h-4" />;
    if (isAvailable === true) return <Check className="w-4 h-4" />;
    if (isAvailable === false) return <X className="w-4 h-4" />;
    return null;
  };

  const getStatusMessage = () => {
    if (isChecking) return "Mengecek ketersediaan...";
    if (error) return error;
    if (isAvailable === true) return "Username tersedia";
    if (isAvailable === false) return "Username sudah digunakan";
    return "";
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Clear previous check results
    clearCheck();

    // Set new timer for debounced checking
    const timer = setTimeout(() => {
      if (newValue.trim().length >= 3) {
        checkUsername(newValue.trim());
      }
    }, 500); // 500ms delay

    setDebounceTimer(timer);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const inputBorderColor = () => {
    if (isChecking) return "border-gray-300";
    if (error || isAvailable === false)
      return "border-red-300 focus:border-red-500";
    if (isAvailable === true) return "border-green-300 focus:border-green-500";
    return "border-gray-300";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="username">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="relative">
        <Input
          id="username"
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isChecking}
          className={cn("pr-10 transition-colors", inputBorderColor())}
          autoComplete="username"
        />

        {/* Status Icon */}
        <div
          className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2",
            getStatusColor()
          )}
        >
          {getStatusIcon()}
        </div>
      </div>

      {/* Status Message */}
      {(isChecking || error || isAvailable !== null) && (
        <p className={cn("text-sm flex items-center gap-1", getStatusColor())}>
          <span>{getStatusMessage()}</span>
        </p>
      )}

      {/* Username Rules */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Username harus:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>Minimal 3 karakter</li>
          <li>Hanya boleh menggunakan huruf, angka, dan underscore</li>
          <li>Tidak boleh dimulai dengan angka</li>
        </ul>
      </div>
    </div>
  );
}
