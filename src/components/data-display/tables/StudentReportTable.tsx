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
import { getStudentReportData } from "@/lib/api";
import { StudentReportResponse, StudentReportItem } from "@/types/api";
import StudentReportViewDialog from "@/components/dialogs/StudentReportViewDialog";

interface StudentReportTableProps {
  username: string;
  studentName: string;
}

export default function StudentReportTable({
  username,
  studentName,
}: StudentReportTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [reportData, setReportData] = useState<StudentReportResponse | null>(
    null
  );
  const [filteredData, setFilteredData] = useState<StudentReportItem[]>([]);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [selectedReport, setSelectedReport] =
    useState<StudentReportItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch report data
  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudentReportData(username);
      setReportData(response);
      if (response.success) {
        setFilteredData(response.data);
      } else {
        setError(response.message || "Gagal memuat data laporan");
        toast.error(response.message || "Gagal memuat data laporan");
      }
    } catch (err) {
      setError("Gagal memuat data laporan. Silakan coba lagi.");
      toast.error("Gagal memuat data laporan. Silakan coba lagi.");
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Fetch data when component mounts
  useEffect(() => {
    if (username) {
      fetchReportData();
    }
  }, [username, fetchReportData]);

  // Get unique values for filters
  const uniqueStatus = reportData?.data
    ? [
        ...new Set(
          reportData.data.map((item: StudentReportItem) => item.status)
        ),
      ]
    : [];
  const uniquePriorities = reportData?.data
    ? [
        ...new Set(
          reportData.data.map((item: StudentReportItem) => item.priority)
        ),
      ]
    : [];

  // Apply filters
  useEffect(() => {
    if (!reportData?.data) return;

    const filtered = reportData.data.filter((item: StudentReportItem) => {
      const matchesSearch =
        item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes &&
          item.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.result &&
          item.result.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, priorityFilter, reportData]);

  // Format counseling date and time helper function
  const formatCounselingDateTime = (dateString: string, timeString: string) => {
    try {
      if (!dateString) return "Belum dijadwalkan";

      const formattedDate = new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${formattedDate}, ${timeString || "00.00"}`;
    } catch {
      return "Belum dijadwalkan";
    }
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    const variants = {
      menunggu: "bg-yellow-100 text-yellow-800 border-yellow-200",
      disetujui: "bg-blue-100 text-blue-800 border-blue-200",
      dijadwalkan: "bg-purple-100 text-purple-800 border-purple-200",
      selesai: "bg-green-100 text-green-800 border-green-200",
      dibatalkan: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      menunggu: "Menunggu",
      disetujui: "Disetujui",
      dijadwalkan: "Dijadwalkan",
      selesai: "Selesai",
      dibatalkan: "Dibatalkan",
    };
    return labels[status as keyof typeof labels] || status;
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
  const handleViewReport = (report: StudentReportItem) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedReport(null);
  };

  // Column definitions
  const columns: ColumnDef<StudentReportItem>[] = [
    {
      accessorKey: "topic",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Topik Konseling
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[200px] max-w-[300px]">
          <div className="font-medium truncate">{row.original.topic}</div>
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
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Badge className={getStatusBadge(row.original.status)}>
            {getStatusLabel(row.original.status)}
          </Badge>
          <Badge className={getPriorityBadge(row.original.priority)}>
            {row.original.priority.charAt(0).toUpperCase() +
              row.original.priority.slice(1)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "counselor.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Konselor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.counselor.name}</span>,
    },
    {
      accessorKey: "room",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Ruangan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          {row.original.room}
        </Badge>
      ),
    },
    {
      accessorKey: "datetime",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Waktu Konseling
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 min-w-[150px]">
          {formatCounselingDateTime(row.original.date, row.original.time)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewReport(report)}
              className="min-w-30 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-1 h-8"
            >
              <Eye className="w-3 h-3 mr-1" />
              Lihat Detail
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Data Laporan Konseling
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Riwayat jadwal konseling dari {studentName}
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
            placeholder="Cari topik, catatan, atau hasil konseling..."
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
                  {getStatusLabel(status)}
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
          <span className="ml-2 text-gray-600">
            Memuat data laporan konseling...
          </span>
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
      <StudentReportViewDialog
        report={selectedReport}
        isOpen={isViewDialogOpen}
        onClose={handleCloseViewDialog}
      />
    </>
  );
}
