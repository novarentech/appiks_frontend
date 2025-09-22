"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import CurhatReplyDialog from "@/components/dialogs/CurhatReplyDialog";
import CurhatViewDialog from "@/components/dialogs/CurhatViewDialog";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect, useCallback } from "react";
import { Eye, MessageCircle, ArrowUpDown, Loader2 } from "lucide-react";
import { getInitials } from "@/lib/utils";

// Types
import { Sharing } from "@/types/api";
import { getSharingList, replySharing } from "@/lib/api";

interface ConfidentTableProps {
  onResponseSubmit?: (curhatId: number, response: string) => void;
}

export default function ConfidentTable({
  onResponseSubmit,
}: ConfidentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [prioritasFilter, setPrioritasFilter] = useState("all");
  const [curhatData, setCurhatData] = useState<Sharing[]>([]);
  const [filteredData, setFilteredData] = useState<Sharing[]>([]);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [selectedCurhat, setSelectedCurhat] = useState<Sharing | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch data from API
  const fetchCurhatData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSharingList();

      if (result.success) {
        setCurhatData(result.data);
        setFilteredData(result.data);
      } else {
        setError(result.message || "Gagal mengambil data");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reply to curhat
  const replyToCurhat = useCallback(
    async (id: number, text: string) => {
      try {
        const result = await replySharing(id, text);

        if (result.success) {
          // Refresh data after successful reply
          await fetchCurhatData();
          if (onResponseSubmit) {
            onResponseSubmit(id, text);
          }
          return true;
        } else {
          setError(result.message || "Gagal mengirim balasan");
          return false;
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengirim balasan");
        console.error("Error replying to curhat:", err);
        return false;
      }
    },
    [fetchCurhatData, onResponseSubmit]
  );

  // Initialize data
  useEffect(() => {
    fetchCurhatData();
  }, [fetchCurhatData]);

  // Get unique values for filters
  const uniqueStatus = [
    ...new Set(curhatData.map((item) => (item.reply ? "dibalas" : "terkirim"))),
  ];
  const uniquePrioritas = [...new Set(curhatData.map((item) => item.priority))];

  // Apply filters
  useEffect(() => {
    const filtered = curhatData.filter((item) => {
      const matchesSearch =
        item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "terkirim" && !item.reply) ||
        (statusFilter === "dibalas" && item.reply);
      const matchesPrioritas =
        prioritasFilter === "all" || item.priority === prioritasFilter;

      return matchesSearch && matchesStatus && matchesPrioritas;
    });
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, prioritasFilter, curhatData]);

  // Helper functions
  const getStatusBadge = (status: string) => {
    const variants = {
      terkirim: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dibalas: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getPrioritasBadge = (prioritas: string) => {
    const variants = {
      rendah: "bg-blue-100 text-blue-800 border-blue-200",
      sedang: "bg-orange-100 text-orange-800 border-orange-200",
      tinggi: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      variants[prioritas as keyof typeof variants] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const handleReply = (curhat: Sharing) => {
    setSelectedCurhat(curhat);
    setIsReplyDialogOpen(true);
  };

  const handleView = (curhat: Sharing) => {
    setSelectedCurhat(curhat);
    setIsViewDialogOpen(true);
  };

  // Column definitions
  const columns: ColumnDef<Sharing>[] = [
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Nama Siswa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[150px] flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-blue-600">
              {getInitials(row.original.user.name)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium truncate">
              {row.original.user.name}
            </span>
            <span className="font-mono text-sm">
              {row.original.user.identifier}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "user.room.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Kelas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {row.original.user.room?.name || "-"}
        </Badge>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Curhatan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[200px] max-w-[300px]">
          <div className="font-medium truncate">{row.original.title}</div>
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
        const status = row.original.reply ? "dibalas" : "terkirim";
        return (
          <div className="flex items-center space-x-3">
            <Badge className={getStatusBadge(status)}>
              {status === "terkirim" ? "Terkirim" : "Dibalas"}
            </Badge>
            <Badge className={getPrioritasBadge(row.original.priority)}>
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
          Waktu Dibuat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        const formattedDate = date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div className="text-sm text-gray-600 min-w-[120px]">
            {formattedDate}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const curhat = row.original;
        return (
          <div className="flex gap-2">
            {!curhat.reply ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleReply(curhat)}
                className="min-w-30 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-8"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Balas
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(curhat)}
                className="min-w-30 text-green-600 border-green-200 hover:bg-green-50 text-xs px-3 py-1 h-8"
              >
                <Eye className="w-3 h-3 mr-1" />
                Lihat Balasan
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari nama siswa, NISN, atau judul curhatan..."
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
                  {status === "terkirim" ? "Terkirim" : "Dibalas"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={prioritasFilter} onValueChange={setPrioritasFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter Prioritas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Prioritas</SelectItem>
              {uniquePrioritas.map((prioritas) => (
                <SelectItem key={prioritas} value={prioritas}>
                  {prioritas.charAt(0).toUpperCase() + prioritas.slice(1)}
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

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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

      {/* Dialogs */}
      <CurhatReplyDialog
        curhat={selectedCurhat}
        isOpen={isReplyDialogOpen}
        onClose={() => setIsReplyDialogOpen(false)}
        onSubmit={async (id, text) => {
          const success = await replyToCurhat(id, text);
          if (success) {
            setIsReplyDialogOpen(false);
          }
        }}
      />

      <CurhatViewDialog
        curhat={selectedCurhat}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
    </div>
  );
}
