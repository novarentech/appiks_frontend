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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/ui/data-table";
import UserDetailDialog from "@/components/dialogs/UserDetailDialog";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Eye, ArrowUpDown } from "lucide-react";
import { getDashboardUsers } from "@/lib/api";
import { User } from "@/types/api";

// Types
interface SchoolUser {
  id: number;
  nama: string;
  username: string;
  kontak: string;
  peran: "Siswa" | "Guru Wali" | "Guru BK" | "Admin TU" | "Super Admin" | "Kepala Sekolah";
  waktuDibuat: string;
  nisn?: string;
  nip?: string;
  kelas?: string;
  guruWali?: string;
  status?: "Aktif" | "Tidak Aktif";
  verified?: boolean;
}

export default function SchoolDataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [peranFilter, setPenanFilter] = useState("all");
  const [filteredData, setFilteredData] = useState<SchoolUser[]>([]);
  const [schoolData, setSchoolData] = useState<SchoolUser[]>([]);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<SchoolUser | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getDashboardUsers();
        if (response.success) {
          const transformedData = response.data.map((user: User) => {
            // Map role from API to display role
            let peran: SchoolUser["peran"] = "Siswa";
            switch (user.role) {
              case "teacher":
                peran = "Guru Wali";
                break;
              case "counselor":
                peran = "Guru BK";
                break;
              case "admin":
                peran = "Admin TU";
                break;
              case "super":
                peran = "Super Admin";
                break;
              case "headteacher":
                peran = "Kepala Sekolah";
                break;
              default:
                peran = "Siswa";
            }

            return {
              id: user.id || 0,
              nama: user.name,
              username: user.username,
              kontak: user.phone,
              peran,
              waktuDibuat: user.created_at ? new Date(user.created_at).toLocaleString("id-ID") : "",
              nisn: user.role === "student" ? user.identifier : undefined,
              nip: user.role !== "student" ? user.identifier : undefined,
              kelas: user.room?.name,
              guruWali: user.mentor?.name,
              status: user.verified ? "Aktif" : "Tidak Aktif",
              verified: user.verified,
            } as SchoolUser;
          });
          setSchoolData(transformedData);
          setFilteredData(transformedData);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Get unique values for filter options
  const uniquePeran = [...new Set(schoolData.map((user) => user.peran))];

  // Apply filters when filter values change
  useEffect(() => {
    const filtered = schoolData.filter((user) => {
      const matchesSearch =
        user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.kontak.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPeran = peranFilter === "all" || user.peran === peranFilter;

      return matchesSearch && matchesPeran;
    });
    setFilteredData(filtered);
  }, [searchTerm, peranFilter, schoolData]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePeranFilter = (value: string) => {
    setPenanFilter(value);
  };

  const handleViewDetail = (user: SchoolUser) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  // Helper functions for badges
  const getPeranBadge = (peran: string) => {
    const variants = {
      Siswa: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Guru Wali": "bg-purple-100 text-purple-800 border-purple-200",
      "Guru BK": "bg-blue-100 text-blue-800 border-blue-200",
      "Admin TU": "bg-pink-100 text-pink-800 border-pink-200",
      "Super Admin": "bg-red-100 text-red-800 border-red-200",
      "Kepala Sekolah": "bg-green-100 text-green-800 border-green-200",
    };
    return (
      variants[peran as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Column definitions for the data table
  const columns: ColumnDef<SchoolUser>[] = [
    {
      accessorKey: "nama",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const initials = getInitials(user.nama);
        return (
          <div className="flex items-center space-x-3 min-w-[150px]">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 `}
            >
              <span className="text-sm font-medium">{initials}</span>
            </div>
            <span className="font-medium text-gray-900 truncate">
              {user.nama}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-gray-600 font-mono text-sm min-w-[120px] block">
          {row.getValue("username")}
        </span>
      ),
    },
    {
      accessorKey: "kontak",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Kontak
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-gray-600 font-mono text-sm">
          {row.getValue("kontak")}
        </span>
      ),
    },
    {
      accessorKey: "peran",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Peran
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const peran = row.getValue("peran") as string;
        return (
          <Badge variant="outline" className={getPeranBadge(peran)}>
            {peran}
          </Badge>
        );
      },
    },
    {
      accessorKey: "waktuDibuat",
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
      cell: ({ row }) => (
        <span className="text-gray-600 text-sm min-w-[140px] block">
          {row.getValue("waktuDibuat")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50 w-8 h-8 p-0"
                  onClick={() => handleViewDetail(user)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lihat Detail</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls - Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Cari..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filter Dropdowns and Page Size */}
        <div className="flex flex-col sm:flex-row lg:flex-nowrap gap-2 lg:gap-3">
          {/* Peran Filter */}
          <div className="w-full sm:min-w-[160px] lg:w-[160px]">
            <Select value={peranFilter} onValueChange={handlePeranFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Pilih Peran</SelectItem>
                {uniquePeran.map((peran) => (
                  <SelectItem key={peran} value={peran}>
                    {peran}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto lg:w-auto">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap hidden sm:block">
              Tampilkan:
            </span>
            <span className="text-sm font-medium text-gray-600 sm:hidden">
              Per halaman:
            </span>
            <Select
              value={currentPageSize.toString()}
              onValueChange={(value) => setCurrentPageSize(Number(value))}
            >
              <SelectTrigger className="w-[80px] sm:w-[80px] lg:w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchColumn=""
        searchPlaceholder=""
        showColumnToggle={false}
        showPagination={true}
        pageSize={currentPageSize}
        pageSizeOptions={[5, 10, 15, 20, 25, 50]}
        showPageSizeSelector={false}
      />

      {/* Detail Dialog */}
      <UserDetailDialog
        user={selectedUser}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
      />
    </div>
  );
}
