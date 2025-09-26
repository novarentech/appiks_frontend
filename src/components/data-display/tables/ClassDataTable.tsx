"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { Eye, Edit, Trash2, Plus, Search, Home, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { getRooms, createRoom, updateRoom, deleteRoom } from "@/lib/api";
import { toast } from "sonner";

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

// Static tingkat options for form
const staticTingkatOptions = [
  { value: "X", label: "X" },
  { value: "XI", label: "XI" },
  { value: "XII", label: "XII" },
];

export default function ClassDataTable() {
  const [data, setData] = useState<ClassItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Generate tingkat options dynamically
  const tingkatOptions = getTingkatOptions(data);
  
  // Fetch data from API
  const fetchData = async () => {
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
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Dialog state
  const [openDialog, setOpenDialog] = useState<null | {
    type: "lihat" | "edit" | "hapus" | "tambah";
    row?: ClassItem;
  }>(null);

  // Form state for tambah/edit
  const [form, setForm] = useState<{
    name?: string;
    level?: string;
    code?: string;
    school?: string;
  }>({});

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
                      setForm({
                        name: item.name,
                        level: item.level,
                        code: item.code,
                        school: item.school?.name || '',
                      });
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
                      setForm({
                        name: item.name,
                        level: item.level,
                        code: item.code,
                        school: item.school?.name || '',
                      });
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

  // Dialog form handlers
  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTambah = async () => {
    try {
      if (!form.name || !form.level) {
        toast.error("Form tidak lengkap. Semua field harus diisi.");
        return;
      }
      
      // Call API to create new room
      const response = await createRoom({
        name: form.name,
        level: form.level,
      });
      
      if (response.success) {
        // Refresh data after successful creation
        await fetchData();
        setForm({});
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
    }
  };

  const handleEdit = async () => {
    try {
      if (!openDialog?.row) {
        toast.error("Tidak ada data yang dipilih untuk diedit.");
        return;
      }
      if (!form.name || !form.level) {
        toast.error("Form tidak lengkap. Nama kelas dan tingkat harus diisi.");
        return;
      }
      
      // Call API to update room
      const response = await updateRoom(openDialog.row.id, {
        name: form.name,
        level: form.level,
      });
      
      if (response.success) {
        // Refresh data after successful update
        await fetchData();
        setForm({});
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
  };

  const handleDelete = async () => {
    try {
      if (!openDialog?.row) {
        toast.error("Tidak ada data yang dipilih untuk dihapus.");
        return;
      }
      
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
    }
  };

  function DialogForm({
    type,
    readOnly = false,
  }: {
    type: "tambah" | "edit" | "lihat";
    readOnly?: boolean;
  }) {
    const isTambah = type === "tambah";
    const isEdit = type === "edit";

    return (
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (isTambah) handleTambah();
          if (isEdit) handleEdit();
        }}
      >
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isTambah ? (
              <>
                <Home className="h-6 w-6 text-[#6C63FF]" />
                Tambah Kelas
              </>
            ) : isEdit ? (
              <>
                <Pencil className="h-6 w-6 text-[#6C63FF]" />
                Edit Kelas
              </>
            ) : (
              <>
                <Eye className="h-6 w-6 text-[#6C63FF]" />
                Detail Kelas
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {isEdit && (
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">
                Nama Sekolah
                <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nama Sekolah"
                value={form.school || ""}
                onChange={(e) => handleFormChange("school", e.target.value)}
                disabled={true}
                className=""
                required
              />
            </div>
          )}
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">
              Nama Kelas
              {(isTambah || isEdit) && <span className="text-red-500">*</span>}
            </label>
            <Input
              placeholder="Nama Kelas"
              value={form.name || ""}
              onChange={(e) => handleFormChange("name", e.target.value)}
              disabled={readOnly}
              className=""
              required={isTambah || isEdit}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">
              Tingkat
              {(isTambah || isEdit) && <span className="text-red-500">*</span>}
            </label>
            <Select
              value={form.level || ""}
              onValueChange={(v) => handleFormChange("level", v)}
              disabled={readOnly}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Pilih Tingkat" />
              </SelectTrigger>
              <SelectContent>
                {staticTingkatOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {(isTambah || isEdit) && (
          <DialogFooter className="pt-4 border-t gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                isTambah
                  ? !form.name || !form.level
                  : !form.name || !form.level
              }
            >
              {isTambah ? (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-1" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </form>
    );
  }

  function DialogLihat() {
    return (
      <div className="w-full">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-[#37364F]">
            <Eye className="h-7 w-7 text-[#6C63FF]" />
            Detail Kelas
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Nama Sekolah</label>
            <Input value={form.school || ""} disabled className="h-12" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">
                Nama Kelas
              </label>
              <Input value={form.name || ""} disabled className="h-12" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Tingkat</label>
              <Input value={form.level || ""} disabled className="h-12" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Kode Kelas</label>
            <Input value={form.code || ""} disabled className="h-12" />
          </div>
        </div>
        <DialogFooter className="pt-4 border-t flex flex-row gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
        </DialogFooter>
      </div>
    );
  }

  function DialogHapus() {
    return (
      <div className="w-full">
        <DialogTitle className="flex items-center gap-2 text-xl border-b pb-4">
          <Trash2 className="w-8 h-8 text-[#FF5A5F]" />
          Hapus Kelas
        </DialogTitle>
        <div className="text-center py-4">
          <p>
            Yakin ingin menghapus kelas <b>{openDialog?.row?.name}</b>?
          </p>
        </div>
        <DialogFooter className="pt-4 border-t flex flex-row gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleDelete}>
            Hapus
          </Button>
        </DialogFooter>
      </div>
    );
  }

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
      {loading && (
        <div className="flex justify-center items-center py-8">
          <p>Memuat data kelas...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={fetchData}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
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
          {openDialog?.type === "tambah" && <DialogForm type="tambah" />}
          {openDialog?.type === "edit" && <DialogForm type="edit" />}
          {openDialog?.type === "lihat" && <DialogLihat />}
          {openDialog?.type === "hapus" && <DialogHapus />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
