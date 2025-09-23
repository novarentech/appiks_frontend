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
import { ClipboardCheck, X, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { closeReport } from "@/lib/api";
import { CounselingSchedule } from "@/types/api";

interface CompleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: CounselingSchedule | null;
  onRefreshData: () => Promise<void>;
}

export default function CompleteDialog({
  isOpen,
  onClose,
  schedule,
  onRefreshData,
}: CompleteDialogProps) {
  const [completionNote, setCompletionNote] = useState("");

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
      setCompletionNote("");
    }
  }, [isOpen]);

  const handleSubmitCompletion = async () => {
    if (schedule && completionNote.trim()) {
      try {
        const completionData = {
          result: completionNote,
        };

        const response = await closeReport(schedule.id, completionData);
        if (response.success) {
          toast.success("Konseling berhasil ditandai selesai");
          await onRefreshData();
          onClose();
        } else {
          toast.error(response.message || "Gagal menyelesaikan konseling");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat menyelesaikan konseling");
        console.error("Error completing schedule:", error);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-green-500" />
            <DialogTitle>Tandai Selesai</DialogTitle>
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
              <label className="text-sm font-medium block mb-2">
                Catatan Hasil Konseling{" "}
                <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
                placeholder="Tulis hasil konseling, rekomendasi tindak lanjut, dan kesimpulan sesi konseling..."
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 20 karakter diperlukan untuk menyelesaikan konseling
              </p>
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
            onClick={handleSubmitCompletion}
            disabled={
              !completionNote.trim() || completionNote.trim().length < 20
            }
          >
            Selesai <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}