"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getRooms, createRoom, updateRoom, deleteRoom } from "@/lib/api";
import { toast } from "sonner";
import ClassDialogForms from "@/components/dashboard/dialogs/ClassDialogForms";

export interface ClassItem {
  id: number;
  name: string;
  level: string;
  code: string;
  school_id: number;
  created_at?: string;
  school?: {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    district: string;
    city: string;
    province: string;
  };
  mention: string;
}

// Generate tingkat options dynamically from data
const getTingkatOptions = (data: ClassItem[]) => {
  const uniqueLevels = [...new Set(data.map(item => item.level).filter((level): level is string => Boolean(level)))];
  return uniqueLevels.map(level => ({
    value: level,
    label: level
  }));
};

export default function ClassDataTable() {
  const [data, setData] = useState<ClassItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  
  // Generate tingkat options dynamically
  const tingkatOptions = getTingkatOptions(data);
  
  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRooms();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || "Gagal memuat data kelas");
        toast.error(response.message || "Gagal memuat data kelas");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data kelas");
      toast.error("Terjadi kesalahan saat memuat data kelas");
      console.error("Error fetching class data:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Dialog state
  const [openDialog, setOpenDialog] = useState<null | {
    type: "lihat" | "edit" | "hapus" | "tambah";
    row?: ClassItem;
  }>(null);

  // Form state for tambah/edit
  const [, setForm] = useState<Partial<ClassItem>>({});

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      // Tingkat filter
      const matchesTingkat = statusFilter === "all" || item.level === statusFilter;
      return matchesSearch && matchesTingkat;
    });
  }, [data, searchQuery, statusFilter]);

  // Table columns
  const columns: ColumnDef<ClassItem>[] = [
    {
      accessorKey: "name",
      header: "Kelas",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "level",
      header: "Tingkat",
      cell: ({ row }) => <div>{row.original.level}</div>,
    },
    {
      accessorKey: "code",
      header: "Kode Kelas",
      cell: ({ row }) => <div>{row.original.code}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Waktu Dibuat",
      cell: ({ row }) => <div>{row.original.created_at ? new Date(row.original.created_at).toLocaleString('id-ID') : '-'}</div>,
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpenDialog({ type: "lihat", row: item });
                      setForm(item);
                    }}
                    className="h-8 w-8 p-0 bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lihat Detail</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpenDialog({ type: "edit", row: item });
                      setForm(item);
                    }}
                    className="h-8 w-8 p-0 bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpenDialog({ type: "hapus", row: item })}
                    className="h-8 w-8 p-0 bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hapus</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  // Handle form submission from dialog - now receives form data
  const handleTambah = useCallback(async (formData: Partial<ClassItem>) => {
    try {
      setAddLoading(true);
      
      // Call API to create new room
      const response = await createRoom({
        name: formData.name!,
        level: formData.level!,
      });
      
      if (response.success) {
        // Refresh data after successful creation
        await fetchData();
        setOpenDialog(null);
        toast.success("Kelas berhasil ditambahkan, data telah diperbarui");
      } else {
        setError(response.message || "Gagal menambah kelas");
        toast.error(response.message || "Gagal menambah kelas");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menambah kelas");
      toast.error("Terjadi kesalahan saat menambah kelas");
      console.error("Error saat menambah kelas:", error);
    } finally {
      setAddLoading(false);
    }
  }, [fetchData]);

  const handleEdit = useCallback(async (formData: Partial<ClassItem>) => {
    try {
      if (!openDialog?.row) {
        toast.error("Tidak ada data yang dipilih untuk diedit.");
        return;
      }
      
      // Call API to update room
      const response = await updateRoom(openDialog.row.id, {
        name: formData.name!,
        level: formData.level!,
      });
      
      if (response.success) {
        // Refresh data after successful update
        await fetchData();
        setOpenDialog(null);
        toast.success("Kelas berhasil diperbarui, data telah diperbarui");
      } else {
        setError(response.message || "Gagal memperbarui kelas");
        toast.error(response.message || "Gagal memperbarui kelas");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat memperbarui kelas");
      toast.error("Terjadi kesalahan saat memperbarui kelas");
      console.error("Error saat memperbarui kelas:", error);
    }
  }, [openDialog, fetchData]);

  const handleDelete = useCallback(async () => {
    try {
      if (!openDialog?.row) {
        toast.error("Tidak ada data yang dipilih untuk dihapus.");
        return;
      }
      
      setDeleteLoading(true);
      
      // Call API to delete room
      const response = await deleteRoom(openDialog.row.id);
      
      if (response.success) {
        // Refresh data after successful deletion
        await fetchData();
        setOpenDialog(null);
        toast.success("Kelas berhasil dihapus, data telah diperbarui");
      } else {
        setError(response.message || "Gagal menghapus kelas");
        toast.error(response.message || "Gagal menghapus kelas");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menghapus kelas");
      toast.error("Terjadi kesalahan saat menghapus kelas");
      console.error("Error saat menghapus kelas:", error);
    } finally {
      setDeleteLoading(false);
    }
  }, [openDialog, fetchData]);

  return (
    <div className="w-full space-y-6">
      {/* Controls Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search & Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-48"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Pilih Tingkat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tingkat</SelectItem>
              {tingkatOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Right: Page size & Tambah Kelas */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Baris per halaman:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              setOpenDialog({ type: "tambah" });
              setForm({});
            }}
            className="bg-[#6C63FF] hover:bg-[#554fd8] text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Kelas
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#6C63FF]" />
          <span className="ml-2 text-gray-600">Memuat data kelas...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">Error: {error}</div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="text-[#6C63FF] border-[#6C63FF]"
          >
            Coba Lagi
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          showColumnToggle={false}
          showPagination={true}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          showPageSizeSelector={false}
        />
      )}

      {/* Dialogs */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <ClassDialogForms
            openDialog={openDialog}
            onTambah={handleTambah}
            onEdit={handleEdit}
            onDelete={handleDelete}
            setOpenDialog={setOpenDialog}
            deleteLoading={deleteLoading}
            addLoading={addLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
