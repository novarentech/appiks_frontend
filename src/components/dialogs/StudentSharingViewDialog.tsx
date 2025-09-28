"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Calendar, Clock } from "lucide-react";
import { StudentSharingItem } from "@/types/api";

interface StudentSharingViewDialogProps {
  sharing: StudentSharingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSharingViewDialog({
  sharing,
  isOpen,
  onClose,
}: StudentSharingViewDialogProps) {
  if (!sharing) return null;

  // Format date and time
  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <DialogTitle>Detail Curhat</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6 px-1">
            {/* Title Section */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-semibold text-xl text-gray-900 flex-1 pr-4">
                  {sharing.title}
                </h4>
              </div>
              
              {/* Description/Content */}
              {sharing.description && (
                <div className="space-y-4">
                  <div className="border-t border-blue-100 pt-4">
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Isi Curhat
                    </h5>
                    <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                      {sharing.description}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Creation Date and Time */}
              <div className="border-t border-blue-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Tanggal & Jam Dibuat:</span>
                  </div>
                  <span className="font-medium text-gray-700">
                    {formatDateTime(sharing.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Reply Section (if exists) */}
            {sharing.reply && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-3 text-lg flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Balasan
                </h5>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                  {sharing.reply}
                </p>
                {sharing.replied_at && (
                  <div className="border-t border-green-100 pt-4 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-green-600">
                        <Calendar className="w-4 h-4" />
                        <span>Dibalas pada:</span>
                      </div>
                      <span className="font-medium text-green-700">
                        {formatDateTime(sharing.replied_at)}
                      </span>
                    </div>
                    {sharing.replied_by && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <div className="flex items-center gap-2 text-green-600">
                          <span>Oleh:</span>
                        </div>
                        <span className="font-medium text-green-700">
                          {sharing.replied_by}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
