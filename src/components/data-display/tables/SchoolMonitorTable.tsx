"use client";

import React, { useState, useMemo } from "react";
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
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Dummy data sekolah dengan kecamatan, kota, provinsi
const sampleData = [
  {
    id: "1",
    nama: "SMA 01 Solo",
    kecamatan: "Magelang Selatan",
    alamat: "Jl. Merah Putih",
    kota: "Solo",
    provinsi: "Jawa Tengah",
    telepon: "0271-12345",
    email: "sma01solo@email.com",
    waktu: "27/08/2025 10:00",
  },
  {
    id: "2",
    nama: "SMA 02 Magelang",
    kecamatan: "Magelang Utara",
    alamat: "Jl. Diponegoro",
    kota: "Magelang",
    provinsi: "Jawa Tengah",
    telepon: "0293-54321",
    email: "sma02magelang@email.com",
    waktu: "28/08/2025 09:30",
  },
  {
    id: "3",
    nama: "SMA 03 Solo",
    kecamatan: "Laweyan",
    alamat: "Jl. Slamet Riyadi",
    kota: "Solo",
    provinsi: "Jawa Tengah",
    telepon: "0271-67890",
    email: "sma03solo@email.com",
    waktu: "29/08/2025 08:15",
  },
  {
    id: "4",
    nama: "SMA 04 Bandung",
    kecamatan: "Cicendo",
    alamat: "Jl. Asia Afrika",
    kota: "Bandung",
    provinsi: "Jawa Barat",
    telepon: "022-123456",
    email: "sma04bandung@email.com",
    waktu: "30/08/2025 11:00",
  },
  {
    id: "5",
    nama: "SMA 05 Surabaya",
    kecamatan: "Genteng",
    alamat: "Jl. Tunjungan",
    kota: "Surabaya",
    provinsi: "Jawa Timur",
    telepon: "031-654321",
    email: "sma05surabaya@email.com",
    waktu: "31/08/2025 13:45",
  },
  {
    id: "6",
    nama: "SMA 06 Solo",
    kecamatan: "Banjarsari",
    alamat: "Jl. Adi Sucipto",
    kota: "Solo",
    provinsi: "Jawa Tengah",
    telepon: "0271-112233",
    email: "sma06solo@email.com",
    waktu: "01/09/2025 07:50",
  },
  {
    id: "7",
    nama: "SMA 07 Magelang",
    kecamatan: "Magelang Tengah",
    alamat: "Jl. Sudirman",
    kota: "Magelang",
    provinsi: "Jawa Tengah",
    telepon: "0293-998877",
    email: "sma07magelang@email.com",
    waktu: "02/09/2025 10:20",
  },
  {
    id: "8",
    nama: "SMA 08 Solo",
    kecamatan: "Serengan",
    alamat: "Jl. Veteran",
    kota: "Solo",
    provinsi: "Jawa Tengah",
    telepon: "0271-445566",
    email: "sma08solo@email.com",
    waktu: "03/09/2025 12:10",
  },
];

// Opsi kecamatan unik dari data
const kecamatanOptions = [
  { value: "all", label: "Pilih Kecamatan" },
  ...Array.from(new Set(sampleData.map((item) => item.kecamatan))).map((kec) => ({
    value: kec,
    label: kec,
  })),
];

// Opsi kota/kabupaten unik dari data
const kotaOptions = [
  { value: "all", label: "Pilih Kota/Kabupaten" },
  ...Array.from(new Set(sampleData.map((item) => item.kota))).map((kota) => ({
    value: kota,
    label: kota,
  })),
];

// Opsi provinsi unik dari data
const provinsiOptions = [
  { value: "all", label: "Pilih Provinsi" },
  ...Array.from(new Set(sampleData.map((item) => item.provinsi))).map((prov) => ({
    value: prov,
    label: prov,
  })),
];

export interface School {
  id: string;
  nama: string;
  kecamatan: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telepon: string;
  email: string;
  waktu: string;
}

export default function SchoolMonitorTable() {
  const [data, setData] = useState<School[]>(sampleData);
  const [searchQuery, setSearchQuery] = useState("");
  const [kecamatanFilter, setKecamatanFilter] = useState("all");
  const [kotaFilter, setKotaFilter] = useState("all");
  const [provinsiFilter, setProvinsiFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  // Dialog state
  const [openDialog, setOpenDialog] = useState<null | {
    type: "lihat" | "edit" | "hapus" | "tambah";
    row?: School;
  }>(null);

  // Form state
  const [form, setForm] = useState<Partial<School>>({});

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesKecamatan =
        kecamatanFilter === "all" || item.kecamatan === kecamatanFilter;
      const matchesKota = kotaFilter === "all" || item.kota === kotaFilter;
      const matchesProvinsi =
        provinsiFilter === "all" || item.provinsi === provinsiFilter;
      return matchesSearch && matchesKecamatan && matchesKota && matchesProvinsi;
    });
  }, [data, searchQuery, kecamatanFilter, kotaFilter, provinsiFilter]);

  // Table columns
  const columns: ColumnDef<School>[] = [
    {
      accessorKey: "nama",
      header: "Sekolah",
      cell: ({ row }) => <div className="font-medium">{row.original.nama}</div>,
    },
    {
      accessorKey: "kecamatan",
      header: "Kecamatan",
      cell: ({ row }) => <div>{row.original.kecamatan}</div>,
    },
    {
      accessorKey: "kota",
      header: "Kota/Kabupaten",
      cell: ({ row }) => <div>{row.original.kota}</div>,
    },
    {
      accessorKey: "provinsi",
      header: "Provinsi",
      cell: ({ row }) => <div>{row.original.provinsi}</div>,
    },
    {
      accessorKey: "waktu",
      header: "Waktu Dibuat",
      cell: ({ row }) => <div>{row.original.waktu || "-"}</div>,
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
                  <p>Lihat Data</p>
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
                  <p>Edit Data</p>
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
  const handleFormChange = (field: keyof School, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTambah = () => {
    if (
      !form.nama ||
      !form.kecamatan ||
      !form.alamat ||
      !form.kota ||
      !form.provinsi ||
      !form.telepon ||
      !form.email
    ) {
      alert("Semua field wajib diisi!");
      return;
    }
    const newId = `school-${Date.now()}`;
    const formattedTime = new Date().toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    setData((prev) => [
      ...prev,
      {
        id: newId,
        nama: form.nama!,
        kecamatan: form.kecamatan!,
        alamat: form.alamat!,
        kota: form.kota!,
        provinsi: form.provinsi!,
        telepon: form.telepon!,
        email: form.email!,
        waktu: formattedTime,
      },
    ]);
    setForm({});
    setOpenDialog(null);
  };

  const handleEdit = () => {
    if (
      !form.nama ||
      !form.kecamatan ||
      !form.alamat ||
      !form.kota ||
      !form.provinsi ||
      !form.telepon ||
      !form.email ||
      !form.id
    ) {
      alert("Semua field wajib diisi!");
      return;
    }
    setData((prev) =>
      prev.map((item) =>
        item.id === form.id
          ? {
              ...item,
              nama: form.nama!,
              kecamatan: form.kecamatan!,
              alamat: form.alamat!,
              kota: form.kota!,
              provinsi: form.provinsi!,
              telepon: form.telepon!,
              email: form.email!,
            }
          : item
      )
    );
    setForm({});
    setOpenDialog(null);
  };

  const handleDelete = () => {
    if (!openDialog?.row?.id) return;
    setData((prev) => prev.filter((item) => item.id !== openDialog.row!.id));
    setForm({});
    setOpenDialog(null);
  };

  function DialogForm({
    type,
    readOnly = false,
  }: {
    type: "tambah" | "edit" | "lihat";
    readOnly?: boolean;
  }) {
    return (
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (type === "tambah") handleTambah();
          if (type === "edit") handleEdit();
        }}
      >
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {type === "tambah" ? (
              <>
              <Plus className="h-6 w-6 text-[#6C63FF]" />
              Tambah Admin TU
              </>
            ) : type === "edit" ? (
              <>
              <Edit className="h-6 w-6 text-[#6C63FF]" />
              Edit Admin TU
              </>
            ) : (
              <>
              <Eye className="h-6 w-6 text-[#6C63FF]" />
              Detail Admin TU
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nama Sekolah<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nama Sekolah"
                value={form.nama || ""}
                onChange={(e) => handleFormChange("nama", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Alamat<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Alamat"
                value={form.alamat || ""}
                onChange={(e) => handleFormChange("alamat", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Kecamatan<span className="text-red-500">*</span>
              </label>
              <Select
                value={form.kecamatan || ""}
                onValueChange={(v) => handleFormChange("kecamatan", v)}
                disabled={readOnly}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Pilih Kecamatan" />
                </SelectTrigger>
                <SelectContent>
                  {kecamatanOptions
                    .filter((opt) => opt.value !== "all")
                    .map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Kota/Kabupaten<span className="text-red-500">*</span>
              </label>
              <Select
                value={form.kota || ""}
                onValueChange={(v) => handleFormChange("kota", v)}
                disabled={readOnly}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Pilih Kota/Kabupaten" />
                </SelectTrigger>
                <SelectContent>
                  {kotaOptions
                    .filter((opt) => opt.value !== "all")
                    .map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Provinsi<span className="text-red-500">*</span>
              </label>
              <Select
                value={form.provinsi || ""}
                onValueChange={(v) => handleFormChange("provinsi", v)}
                disabled={readOnly}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {provinsiOptions
                    .filter((opt) => opt.value !== "all")
                    .map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Telepon<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Telepon"
                value={form.telepon || ""}
                onChange={(e) => handleFormChange("telepon", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Email<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Email"
                value={form.email || ""}
                onChange={(e) => handleFormChange("email", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4 border-t gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          {type !== "lihat" && (
            <Button
              type="submit"
              className="bg-[#6C63FF] hover:bg-[#554fd8] text-white flex items-center gap-2"
            >
              {type === "tambah" ? (
                <>
                  Tambah <Plus className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Simpan <Edit className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </form>
    );
  }

  function DialogDelete() {
    return (
      <div>
        <DialogHeader>
          <DialogTitle>
            <Trash2 className="h-6 w-6 text-red-600 inline-block mr-2" />
            Hapus Sekolah
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Apakah Anda yakin ingin menghapus sekolah{" "}
          <span className="font-semibold">{openDialog?.row?.nama}</span>?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
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
          <Select value={kecamatanFilter} onValueChange={setKecamatanFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Pilih Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              {kecamatanOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={kotaFilter} onValueChange={setKotaFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Pilih Kota/Kabupaten" />
            </SelectTrigger>
            <SelectContent>
              {kotaOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={provinsiFilter} onValueChange={setProvinsiFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Pilih Provinsi" />
            </SelectTrigger>
            <SelectContent>
              {provinsiOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            <Plus className="w-4 h-4" /> Tambah Sekolah
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        showColumnToggle={false}
        showPagination={true}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50]}
        showPageSizeSelector={false}
      />

      {/* Dialogs */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          {openDialog?.type === "tambah" && <DialogForm type="tambah" />}
          {openDialog?.type === "edit" && <DialogForm type="edit" />}
          {openDialog?.type === "lihat" && (
            <DialogForm type="lihat" readOnly={true} />
          )}
          {openDialog?.type === "hapus" && <DialogDelete />}
        </DialogContent>
      </Dialog>
    </div>
  );
}