"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, X, Check } from "lucide-react";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { confirmReport } from "@/lib/api";
import { User, CounselingSchedule } from "@/types/api";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: CounselingSchedule | null;
  counselors: User[];
  onRefreshData: () => Promise<void>;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  schedule,
  counselors,
  onRefreshData,
}: ConfirmationDialogProps) {
  const [confirmationData, setConfirmationData] = useState({
    tanggal: undefined as Date | undefined,
    waktu: "",
    guruBK: "",
    ruangan: "",
    catatan: "",
  });

  // Parse date utility
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    
    try {
      const [year, month, day] = dateString.split("-");
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
    } catch {
      return undefined;
    }
  };

  // Format date and time helper function
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      const formattedDate = format(date, "dd/MM/yyyy");
      const formattedTime = format(date, "HH.mm");
      return `${formattedDate}, ${formattedTime}`;
    } catch {
      return dateTimeString;
    }
  };

  // Initialize form data when schedule changes
  useEffect(() => {
    if (schedule) {
      setConfirmationData({
        tanggal: parseDate(schedule.date),
        waktu: schedule.time || "",
        guruBK: schedule.counselor.name || "",
        ruangan: schedule.room || "",
        catatan: schedule.notes || "",
      });
    }
  }, [schedule]);

  const handleSubmitConfirmation = async () => {
    if (
      schedule &&
      confirmationData.tanggal &&
      confirmationData.waktu &&
      confirmationData.ruangan &&
      confirmationData.guruBK
    ) {
      try {
        // Use existing schedule data for confirmation with selected date/time
        const confirmData = {
          date: confirmationData.tanggal
            ? format(confirmationData.tanggal, "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
          time: confirmationData.waktu,
          notes: confirmationData.catatan,
          room: confirmationData.ruangan,
        };

        const response = await confirmReport(schedule.id, confirmData);
        if (response.success) {
          toast.success("Jadwal konseling berhasil dikonfirmasi");
          await onRefreshData();
          onClose();
        } else {
          toast.error(
            response.message || "Gagal mengkonfirmasi jadwal konseling"
          );
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat mengkonfirmasi jadwal konseling");
        console.error("Error confirming schedule:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <DialogTitle>Konfirmasi Konseling</DialogTitle>
          </div>
        </DialogHeader>

        {schedule && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {getInitials(schedule.user.name)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-blue-800">
                    {schedule.user.name}
                  </div>
                  <div className="text-sm text-blue-600">
                    {schedule.topic}
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-600">
                Dibuat pada : {formatDateTime(schedule.created_at)}
              </div>
              <div className="text-sm text-blue-600">
                Prioritas :{" "}
                <span className="font-semibold">
                  {schedule.priority.charAt(0).toUpperCase() +
                    schedule.priority.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tanggal
                </label>
                <Input
                  type="text"
                  defaultValue={schedule.date || "Belum dijadwalkan"}
                  readOnly
                  className="bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Waktu
                </label>
                <Input
                  type="text"
                  defaultValue={schedule.time || "Belum dijadwalkan"}
                  readOnly
                  className="bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Guru BK <span className="text-red-500">*</span>
              </label>
              <Select
                value={confirmationData.guruBK}
                onValueChange={(value) =>
                  setConfirmationData({ ...confirmationData, guruBK: value })
                }
                disabled
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih guru BK" />
                </SelectTrigger>
                <SelectContent>
                  {counselors.map((counselor) => (
                    <SelectItem
                      key={counselor.username}
                      value={counselor.name}
                    >
                      {counselor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Ruangan <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={confirmationData.ruangan || ""}
                onChange={(e) =>
                  setConfirmationData({
                    ...confirmationData,
                    ruangan: e.target.value,
                  })
                }
                placeholder="Masukkan nama ruangan"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Catatan Konfirmasi (Opsional)
              </label>
              <Textarea
                value={confirmationData.catatan}
                onChange={(e) =>
                  setConfirmationData({
                    ...confirmationData,
                    catatan: e.target.value,
                  })
                }
                placeholder="Catatan konfirmasi, tindak lanjut"
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Batal <X className="ml-2 h-4 w-4" />
          </Button>
          <Button
            onClick={handleSubmitConfirmation}
            disabled={!confirmationData.ruangan || !confirmationData.guruBK}
          >
            Konfirmasi <Check className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}