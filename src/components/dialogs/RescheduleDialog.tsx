"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Edit, X, Check, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { rescheduleReport } from "@/lib/api";
import { User, CounselingSchedule } from "@/types/api";

interface RescheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: CounselingSchedule | null;
  counselors: User[];
  onRefreshData: () => Promise<void>;
}

export default function RescheduleDialog({
  isOpen,
  onClose,
  schedule,
  counselors,
  onRefreshData,
}: RescheduleDialogProps) {
  const [rescheduleData, setRescheduleData] = useState({
    tanggal: undefined as Date | undefined,
    waktu: "",
    guruBK: "",
    ruangan: "",
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
      setRescheduleData({
        tanggal: parseDate(schedule.date),
        waktu: schedule.time || "",
        guruBK: schedule.counselor.name || "",
        ruangan: schedule.room || "",
      });
    }
  }, [schedule]);

  const handleSubmitReschedule = async () => {
    if (
      schedule &&
      rescheduleData.tanggal &&
      rescheduleData.waktu &&
      rescheduleData.guruBK
    ) {
      try {
        const rescheduleDataFormatted = {
          date: format(rescheduleData.tanggal, "yyyy-MM-dd"),
          time: rescheduleData.waktu,
          notes: "Jadwal diubah",
          room: rescheduleData.ruangan,
        };

        const response = await rescheduleReport(
          schedule.id,
          rescheduleDataFormatted
        );
        if (response.success) {
          toast.success("Jadwal konseling berhasil diubah");
          await onRefreshData();
          onClose();
        } else {
          toast.error(response.message || "Gagal mengubah jadwal konseling");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat mengubah jadwal konseling");
        console.error("Error rescheduling:", error);
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
            <Edit className="h-5 w-5 text-blue-500" />
            <DialogTitle>Edit Jadwal Konseling</DialogTitle>
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
                <label className="text-sm font-medium mb-2 block">
                  Tanggal Baru <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !rescheduleData.tanggal && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rescheduleData.tanggal ? (
                        format(rescheduleData.tanggal, "dd/MM/yyyy")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={rescheduleData.tanggal}
                      onSelect={(date) =>
                        setRescheduleData({
                          ...rescheduleData,
                          tanggal: date,
                        })
                      }
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Waktu Baru <span className="text-red-500">*</span>
                </label>
                <Select
                  value={rescheduleData.waktu}
                  onValueChange={(value) =>
                    setRescheduleData({ ...rescheduleData, waktu: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih waktu">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {rescheduleData.waktu || "Pilih waktu"}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="08:30">08:30</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="09:30">09:30</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="10:30">10:30</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="11:30">11:30</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="13:30">13:30</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="14:30">14:30</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="15:30">15:30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Guru BK <span className="text-red-500">*</span>
              </label>
              <Select
                value={rescheduleData.guruBK}
                onValueChange={(value) =>
                  setRescheduleData({ ...rescheduleData, guruBK: value })
                }
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
              <label className="text-sm font-medium">Ruangan</label>
              <Input
                type="text"
                value={rescheduleData.ruangan || ""}
                onChange={(e) =>
                  setRescheduleData({
                    ...rescheduleData,
                    ruangan: e.target.value,
                  })
                }
                placeholder="Masukkan nama ruangan"
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
            onClick={handleSubmitReschedule}
            disabled={
              !rescheduleData.tanggal ||
              !rescheduleData.waktu ||
              !rescheduleData.guruBK
            }
          >
            Simpan <Check className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}