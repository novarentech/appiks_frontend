"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye, Edit, Plus, Loader2, Check, X } from "lucide-react";
import { TuAdmin } from "./TuDataTable";
import { getSchools } from "@/lib/api";
import { School } from "@/types/api";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";

// Separate memoized DialogForm component to prevent re-renders
interface DialogFormProps {
  type: "tambah" | "edit" | "lihat";
  readOnly?: boolean;
  localForm: Partial<TuAdmin>;
  schools: School[];
  schoolsLoading: boolean;
  handleFormChange: (field: keyof TuAdmin, value: string) => void;
  onTambah: (formData: Partial<TuAdmin>) => void;
  onEdit: (formData: Partial<TuAdmin>) => void;
  originalUsername?: string;
}

const DialogForm = memo(function DialogForm({
  type,
  readOnly = false,
  localForm,
  schools,
  schoolsLoading,
  handleFormChange,
  onTambah,
  onEdit,
  originalUsername,
}: DialogFormProps) {
  const {
    isChecking,
    isAvailable: isUsernameAvailable,
    error: usernameError,
    checkUsername,
    clearCheck,
  } = useUsernameCheck();
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Username validation function
  const validateUsername = useCallback((username: string) => {
    const minLength = username.length >= 3;
    const maxLength = username.length <= 20;
    const validChars = /^[a-zA-Z0-9_]+$/.test(username);
    const notStartWithNumber = !/^\d/.test(username);

    return {
      minLength,
      maxLength,
      validChars,
      notStartWithNumber,
      isValid: minLength && maxLength && validChars && notStartWithNumber,
    };
  }, []);

  // Phone validation function
  const validatePhone = useCallback((phone: string) => {
    const digitsOnly = phone.replace(/\D/g, "");
    const isValidLength = digitsOnly.length >= 9 && digitsOnly.length <= 13;
    const startsWithValidDigit = /^[8-9]/.test(digitsOnly);

    return {
      isValidLength,
      startsWithValidDigit,
      isValid: isValidLength && startsWithValidDigit,
    };
  }, []);

  // Email validation function
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
    };
  }, []);

  // Handle username input with debounce
  const handleUsernameChange = useCallback((value: string) => {
    handleFormChange("username", value);

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Clear previous check results
    clearCheck();

    // Set new timer for debounced checking
    const timer = setTimeout(() => {
      if (value.trim().length >= 3 && validateUsername(value.trim()).isValid) {
        checkUsername(value.trim());
      }
    }, 500); // 500ms delay

    setDebounceTimer(timer);
  }, [debounceTimer, clearCheck, checkUsername, validateUsername, handleFormChange]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if username is available (only if username changed and has been checked)
    const usernameChanged = originalUsername !== localForm.username;
    if (
      usernameChanged &&
      (isUsernameAvailable === false || usernameError)
    ) {
      // Username is not available or has error, don't proceed
      return;
    }
    
    // Validation
    if (
      !localForm.sekolah ||
      !localForm.username ||
      !localForm.email ||
      !localForm.nama ||
      !localForm.nip ||
      !localForm.telepon
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    // Username validation
    const usernameValidation = validateUsername(localForm.username || "");
    if (!usernameValidation.isValid) {
      let errorMessage = "Username tidak valid. Harus memenuhi kriteria:\n";
      if (!usernameValidation.minLength) errorMessage += "- Minimal 3 karakter\n";
      if (!usernameValidation.maxLength) errorMessage += "- Maksimal 20 karakter\n";
      if (!usernameValidation.validChars) errorMessage += "- Hanya huruf, angka, dan underscore\n";
      if (!usernameValidation.notStartWithNumber) errorMessage += "- Tidak boleh dimulai dengan angka\n";
      alert(errorMessage);
      return;
    }

    // Email validation
    const emailValidation = validateEmail(localForm.email || "");
    if (!emailValidation.isValid) {
      alert("Format email tidak valid!");
      return;
    }

    // Phone validation
    const phoneValidation = validatePhone(localForm.telepon || "");
    if (!phoneValidation.isValid) {
      let errorMessage = "Nomor telepon tidak valid. Harus memenuhi kriteria:\n";
      if (!phoneValidation.isValidLength) errorMessage += "- 9-13 digit (tanpa +62)\n";
      if (!phoneValidation.startsWithValidDigit) errorMessage += "- Dimulai dengan 8 atau 9\n";
      alert(errorMessage);
      return;
    }

    // NIP validation (must be digits only, 10 characters for admin TU)
    if (!localForm.nip || !/^\d+$/.test(localForm.nip)) {
      alert("NIP/NUPTK hanya boleh mengandung angka!");
      return;
    }
    
    if (localForm.nip.length !== 10) {
      alert("NIP/NUPTK harus 10 karakter!");
      return;
    }

    if (type === "tambah") {
      onTambah(localForm);
    } else if (type === "edit") {
      onEdit(localForm);
    }
  }, [localForm, onTambah, onEdit, type, originalUsername, isUsernameAvailable, usernameError, validateUsername, validatePhone, validateEmail]);

  // Check if form is valid
  const usernameValidation = validateUsername(localForm.username || "");
  const phoneValidation = validatePhone(localForm.telepon || "");
  const emailValidation = validateEmail(localForm.email || "");
  const usernameChanged = originalUsername !== localForm.username;
  
  const isFormValid =
    localForm.sekolah &&
    localForm.username &&
    localForm.email &&
    localForm.nama &&
    localForm.nip &&
    localForm.telepon &&
    usernameValidation.isValid &&
    phoneValidation.isValid &&
    emailValidation.isValid &&
    (!usernameChanged || (isUsernameAvailable === true && !usernameError)) &&
    /^\d+$/.test(localForm.nip || "") &&
    (localForm.nip?.length === 10);

  return (
    <form
      className="w-full"
      onSubmit={handleSubmit}
    >
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="flex items-center gap-2 text-xl">
          {type === "tambah" ? (
            <>
            <Plus className="h-6 w-6 text-[#6C63FF]" />
            Tambah Admin TU
            </>
          ) : type === "edit" ? (
            <>
            <Edit className="h-6 w-6 text-[#6C63FF]" />
            Edit Admin TU
            </>
          ) : (
            <>
            <Eye className="h-6 w-6 text-[#6C63FF]" />
            Detail Admin TU
            </>
          )}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            Pilih Sekolah
          </label>
          {schoolsLoading ? (
            <div className="flex items-center space-x-2 h-12 px-3 py-2 border border-input bg-background rounded-md">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Memuat sekolah...</span>
            </div>
          ) : (
            <Select
              value={localForm.sekolah || ""}
              onValueChange={(v) => handleFormChange("sekolah", v)}
              disabled={readOnly}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Pilih Sekolah" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.name}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Username<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                placeholder="Username untuk login"
                value={localForm.username || ""}
                onChange={(e) => handleUsernameChange(e.target.value)}
                disabled={readOnly || isChecking}
                required
                className={`pr-10 transition-colors ${
                  isChecking
                    ? "border-gray-300"
                    : localForm.username && localForm.username.trim() === "" ||
                      !usernameValidation.isValid
                    ? "border-red-300 focus:border-red-500"
                    : usernameError || isUsernameAvailable === false
                    ? "border-red-300 focus:border-red-500"
                    : isUsernameAvailable === true &&
                      usernameValidation.isValid
                    ? "border-green-300 focus:border-green-500"
                    : "border-gray-300"
                }`}
              />
              
              {/* Status Icon */}
              <div
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  isChecking
                    ? "text-gray-500"
                    : usernameError || isUsernameAvailable === false
                    ? "text-red-500"
                    : isUsernameAvailable === true
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {isChecking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : usernameError || isUsernameAvailable === false ? (
                  <X className="w-4 h-4" />
                ) : isUsernameAvailable === true ? (
                  <Check className="w-4 h-4" />
                ) : null}
              </div>
            </div>
            
            {/* Status Message - Only for availability check */}
            {localForm.username && localForm.username.trim() !== "" && (
              <div className="mt-1">
                {isChecking ? (
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Mengecek ketersediaan...</span>
                  </div>
                ) : usernameError || isUsernameAvailable === false ? (
                  <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm text-red-700 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500" />
                    <span>
                      {usernameError || "Username sudah digunakan"}
                    </span>
                  </div>
                ) : isUsernameAvailable === true && usernameValidation.isValid ? (
                  <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm text-green-700 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Username tersedia</span>
                  </div>
                ) : null}
              </div>
            )}
            
            {localForm.username && (
              <div className="text-xs mt-1">
                <p className="text-gray-600 font-medium mb-1">
                  Username harus memenuhi kriteria:
                </p>
                <ul className="space-y-1">
                  <li className={validateUsername(localForm.username).minLength ? "text-green-600" : "text-red-500"}>
                    Minimal 3 karakter {validateUsername(localForm.username).minLength ? "✓" : "✗"}
                  </li>
                  <li className={validateUsername(localForm.username).maxLength ? "text-green-600" : "text-red-500"}>
                    Maksimal 20 karakter {validateUsername(localForm.username).maxLength ? "✓" : "✗"}
                  </li>
                  <li className={validateUsername(localForm.username).validChars ? "text-green-600" : "text-red-500"}>
                    Hanya huruf, angka, dan underscore {validateUsername(localForm.username).validChars ? "✓" : "✗"}
                  </li>
                  <li className={validateUsername(localForm.username).notStartWithNumber ? "text-green-600" : "text-red-500"}>
                    Tidak boleh dimulai dengan angka {validateUsername(localForm.username).notStartWithNumber ? "✓" : "✗"}
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Email<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Email Akun TU"
              value={localForm.email || ""}
              onChange={(e) => handleFormChange("email", e.target.value)}
              disabled={readOnly}
              required
              type="email"
            />
            {localForm.email && !validateEmail(localForm.email).isValid && (
              <p className="text-xs text-red-500 mt-1">Format email tidak valid</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Nama Lengkap<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nama Lengkap Staff TU"
              value={localForm.nama || ""}
              onChange={(e) => handleFormChange("nama", e.target.value)}
              disabled={readOnly}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              NIP/NUPTK<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nomor Indentitas Pegawai"
              value={localForm.nip || ""}
              onChange={(e) => {
                // Only allow digits
                const value = e.target.value.replace(/\D/g, "");
                handleFormChange("nip", value);
              }}
              disabled={readOnly}
              required
              maxLength={10}
            />
            {localForm.nip && (
              <div className="text-xs mt-1">
                {!/^\d+$/.test(localForm.nip) ? (
                  <p className="text-red-500">NIP/NUPTK hanya boleh mengandung angka</p>
                ) : localForm.nip.length !== 10 ? (
                  <p className="text-red-500">NIP/NUPTK harus 10 karakter</p>
                ) : (
                  <p className="text-green-600">NIP/NUPTK valid</p>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Telepon<span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +62
              </div>
              <Input
                placeholder="812-3456-7890"
                value={localForm.telepon || ""}
                onChange={(e) => {
                  // Remove any non-digit characters
                  const value = e.target.value.replace(/\D/g, "");
                  // Remove leading zero if present
                  if (value.startsWith("0")) {
                    handleFormChange("telepon", value.substring(1));
                  } else {
                    handleFormChange("telepon", value);
                  }
                }}
                disabled={readOnly}
                required
                type="tel"
                className="w-full rounded-l-none"
              />
            </div>
            {localForm.telepon && (
              <div className="text-xs mt-1">
                <p className="text-gray-600 font-medium mb-1">
                  Nomor telepon harus memenuhi kriteria:
                </p>
                <ul className="space-y-1">
                  <li className={validatePhone(localForm.telepon).isValidLength ? "text-green-600" : "text-red-500"}>
                    9-13 digit (tanpa +62) {validatePhone(localForm.telepon).isValidLength ? "✓" : "✗"}
                  </li>
                  <li className={validatePhone(localForm.telepon).startsWithValidDigit ? "text-green-600" : "text-red-500"}>
                    Dimulai dengan 8 atau 9 {validatePhone(localForm.telepon).startsWithValidDigit ? "✓" : "✗"}
                  </li>
                </ul>
                {validatePhone(localForm.telepon).isValid && (
                  <p className="text-green-600">Format: 62{localForm.telepon}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <DialogFooter className="pt-4 border-t gap-3">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Batal
          </Button>
        </DialogClose>
        {type !== "lihat" && (
          <Button
            type="submit"
            className="bg-[#6C63FF] hover:bg-[#554fd8] text-white flex items-center gap-2"
            disabled={!isFormValid || isChecking}
          >
            {type === "tambah" ? (
              <>
                Tambah <Plus className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Simpan <Edit className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </DialogFooter>
    </form>
  );
});

interface TuDialogFormsProps {
  openDialog: { type: "lihat" | "edit" | "hapus" | "tambah"; row?: TuAdmin } | null;
  onTambah: (formData: Partial<TuAdmin>) => void;
  onEdit: (formData: Partial<TuAdmin>) => void;
  onDelete: () => void;
  setOpenDialog: (dialog: null | { type: "lihat" | "edit" | "hapus" | "tambah"; row?: TuAdmin }) => void;
  deleteLoading?: boolean;
}

export default function TuDialogForms({
  openDialog,
  onTambah,
  onEdit,
  onDelete,
  deleteLoading = false,
}: TuDialogFormsProps) {
  // Local form state - this prevents parent re-renders on every keystroke
  const [localForm, setLocalForm] = useState<Partial<TuAdmin>>({});
  
  // Schools data state
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);

  // Initialize form when dialog opens or changes
  useEffect(() => {
    if (openDialog?.type === "tambah") {
      setLocalForm({});
    } else if (openDialog?.type === "edit" || openDialog?.type === "lihat") {
      setLocalForm(openDialog.row || {});
    }
  }, [openDialog]);

  // Fetch schools data when dialog opens
  useEffect(() => {
    const fetchSchools = async () => {
      if (!openDialog) return;
      
      try {
        setSchoolsLoading(true);
        const response = await getSchools();
        if (response.success && response.data) {
          setSchools(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      } finally {
        setSchoolsLoading(false);
      }
    };

    fetchSchools();
  }, [openDialog]);

  // Local form handler - no parent communication until submit
  const handleFormChange = (field: keyof TuAdmin, value: string) => {
    setLocalForm(prev => ({ ...prev, [field]: value }));
  };

  function DialogDelete() {
    return (
      <div>
        <DialogHeader>
          <DialogTitle>
            <svg className="h-6 w-6 text-red-600 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus Admin TU
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Apakah Anda yakin ingin menghapus admin TU{" "}
          <span className="font-semibold">{openDialog?.row?.username}</span>?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={deleteLoading}>
              Batal
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </DialogFooter>
      </div>
    );
  }

  if (!openDialog) return null;

  return (
    <>
      {openDialog.type === "tambah" && (
        <DialogForm
          type="tambah"
          localForm={localForm}
          schools={schools}
          schoolsLoading={schoolsLoading}
          handleFormChange={handleFormChange}
          onTambah={onTambah}
          onEdit={onEdit}
        />
      )}
      {openDialog.type === "edit" && (
        <DialogForm
          type="edit"
          localForm={localForm}
          schools={schools}
          schoolsLoading={schoolsLoading}
          handleFormChange={handleFormChange}
          onTambah={onTambah}
          onEdit={onEdit}
          originalUsername={openDialog.row?.username}
        />
      )}
      {openDialog.type === "lihat" && (
        <DialogForm
          type="lihat"
          readOnly={true}
          localForm={localForm}
          schools={schools}
          schoolsLoading={schoolsLoading}
          handleFormChange={handleFormChange}
          onTambah={onTambah}
          onEdit={onEdit}
          originalUsername={openDialog.row?.username}
        />
      )}
      {openDialog.type === "hapus" && <DialogDelete />}
    </>
  );
}
