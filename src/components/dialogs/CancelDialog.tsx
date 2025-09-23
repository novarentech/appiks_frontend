"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Check } from "lucide-react";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { cancelReport } from "@/lib/api";
import { CounselingSchedule } from "@/types/api";

interface CancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: CounselingSchedule | null;
  onRefreshData: () => Promise<void>;
}

export default function CancelDialog({
  isOpen,
  onClose,
  schedule,
  onRefreshData,
}: CancelDialogProps) {
  const [cancellationReason, setCancellationReason] = useState("");

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

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCancellationReason("");
    }
  }, [isOpen]);

  const handleSubmitCancellation = async () => {
    if (schedule && cancellationReason.trim()) {
      try {
        const cancellationData = {
          result: cancellationReason,
        };

        const response = await cancelReport(
          schedule.id,
          cancellationData
        );
        if (response.success) {
          toast.success("Jadwal konseling berhasil dibatalkan");
          await onRefreshData();
          onClose();
        } else {
          toast.error(response.message || "Gagal membatalkan jadwal konseling");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat membatalkan jadwal konseling");
        console.error("Error cancelling schedule:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-500" />
            <DialogTitle>Batalkan Jadwal</DialogTitle>
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

            <div>
              <label className="text-sm font-medium">
                Alasan Pembatalan <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Alasan pembatan jadwal konseling"
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
            Kembali
          </Button>
          <Button disabled={!cancellationReason.trim()} variant="destructive" onClick={handleSubmitCancellation}>
            Batalkan <Check className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}