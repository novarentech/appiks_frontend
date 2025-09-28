"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Loader2 } from "lucide-react";
import { getStudentSharingData } from "@/lib/api";
import { StudentSharingResponse, StudentSharingItem } from "@/types/api";
import StudentSharingViewDialog from "@/components/dialogs/StudentSharingViewDialog";

interface StudentSharingTableProps {
  username: string;
  studentName: string;
}

export default function StudentSharingTable({
  username,
  studentName,
}: StudentSharingTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sharingData, setSharingData] = useState<StudentSharingResponse | null>(
    null
  );
  const [filteredData, setFilteredData] = useState<StudentSharingItem[]>([]);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [selectedSharing, setSelectedSharing] =
    useState<StudentSharingItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch sharing data
  const fetchSharingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudentSharingData(username);
      setSharingData(response);
      if (response.success) {
        setFilteredData(response.data);
      } else {
        setError(response.message || "Gagal memuat data sharing");
        toast.error(response.message || "Gagal memuat data sharing");
      }
    } catch (err) {
      setError("Gagal memuat data sharing. Silakan coba lagi.");
      toast.error("Gagal memuat data sharing. Silakan coba lagi.");
      console.error("Error fetching sharing data:", err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Fetch data when component mounts
  useEffect(() => {
    if (username) {
      fetchSharingData();
    }
  }, [username, fetchSharingData]);

  // Get unique values for filters
  const uniqueStatus = sharingData?.data
    ? [
        ...new Set(
          sharingData.data.map((item: StudentSharingItem) =>
            item.reply ? "dibalas" : "menunggu"
          )
        ),
      ]
    : [];
  const uniquePriorities = sharingData?.data
    ? [
        ...new Set(
          sharingData.data.map((item: StudentSharingItem) => item.priority)
        ),
      ]
    : [];

  // Apply filters
  useEffect(() => {
    if (!sharingData?.data) return;

    const filtered = sharingData.data.filter((item: StudentSharingItem) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "menunggu" && !item.reply) ||
        (statusFilter === "dibalas" && item.reply);

      const matchesPriority =
        priorityFilter === "all" || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, priorityFilter, sharingData]);

  // Helper functions
  const getStatusBadge = (status: string) => {
    const variants = {
      menunggu: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dibalas: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      rendah: "bg-blue-100 text-blue-800 border-blue-200",
      sedang: "bg-orange-100 text-orange-800 border-orange-200",
      tinggi: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  // Dialog handlers
  const handleViewSharing = (sharing: StudentSharingItem) => {
    setSelectedSharing(sharing);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedSharing(null);
  };

  // Column definitions
  const columns: ColumnDef<StudentSharingItem>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Judul Curhat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[100px] max-w-[200px]">
          <div className="font-medium truncate">{row.original.title}</div>
          {row.original.description && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-2 truncate">
              {row.original.description}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.original.reply ? "dibalas" : "menunggu";
        return (
          <div className="flex items-center space-x-3">
            <Badge className={getStatusBadge(status)}>
              {status === "menunggu" ? "Menunggu" : "Dibalas"}
            </Badge>
            <Badge className={getPriorityBadge(row.original.priority)}>
              {row.original.priority.charAt(0).toUpperCase() +
                row.original.priority.slice(1)}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Dibuat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 min-w-[120px]">
          {new Date(row.original.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewSharing(row.original)}
            className="min-w-30 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-1 h-8"
          >
            <Eye className="w-3 h-3 mr-1" />
            Lihat Detail
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Data Sharing/Curhat
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Riwayat sharing dan curhat dari {studentName}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Cari judul atau deskripsi curhatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {uniqueStatus.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "menunggu" ? "Menunggu" : "Dibalas"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter Prioritas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Prioritas</SelectItem>
              {uniquePriorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap hidden sm:block">
              Tampilkan:
            </span>
            <Select
              value={currentPageSize.toString()}
              onValueChange={(value) => setCurrentPageSize(Number(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Memuat data sharing...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          searchColumn=""
          searchPlaceholder=""
          showColumnToggle={false}
          showPagination={true}
          pageSize={currentPageSize}
          pageSizeOptions={[5, 10, 15, 25, 50]}
          showPageSizeSelector={false}
        />
      )}

      {/* View Dialog */}
      <StudentSharingViewDialog
        sharing={selectedSharing}
        isOpen={isViewDialogOpen}
        onClose={handleCloseViewDialog}
      />
    </>
  );
}
