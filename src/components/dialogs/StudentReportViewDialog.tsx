"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, MapPin, FileText} from "lucide-react";
import { StudentReportItem } from "@/types/api";

interface StudentReportViewDialogProps {
  report: StudentReportItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentReportViewDialog({
  report,
  isOpen,
  onClose,
}: StudentReportViewDialogProps) {
  if (!report) return null;

  // Format date and time helper function
  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      if (!dateString) return "Belum dijadwalkan";

      const formattedDate = new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const formattedTime = timeString || "00.00";
      return `${formattedDate} pukul ${formattedTime}`;
    } catch {
      return "Belum dijadwalkan";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Detail Laporan Konseling
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* Schedule Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(report.date, report.time)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Ruangan</p>
                  <p className="font-medium text-gray-900">{report.room}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Results */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Catatan & Hasil
            </h4>
            
            <div className="space-y-4">
              {report.notes && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Catatan</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{report.notes}</p>
                </div>
              )}
              
              {report.result && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800 mb-2">Hasil Konseling</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{report.result}</p>
                </div>
              )}
              
              {!report.notes && !report.result && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500">Tidak ada catatan atau hasil yang tersedia</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
