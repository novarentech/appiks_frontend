"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import {
  getProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
  getSchools,
} from "@/lib/api";
import { School as ApiSchool } from "@/types/api";

export interface School {
  id: string;
  nama: string;
  kecamatan: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telepon: string;
  email: string;
}

export default function SchoolMonitorTable() {
  const [data, setData] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [kecamatanFilter, setKecamatanFilter] = useState("all");
  const [kotaFilter, setKotaFilter] = useState("all");
  const [provinsiFilter, setProvinsiFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  // API data states
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [, setLoadingSchools] = useState(false);

  // Load provinces and schools on component mount
  useEffect(() => {
    loadProvinces();
    loadSchools();
  }, []);

  // Load cities when province filter changes
  useEffect(() => {
    if (provinsiFilter && provinsiFilter !== "all") {
      loadCities(provinsiFilter);
    } else {
      setCities([]);
      setDistricts([]);
      setKotaFilter("all");
      setKecamatanFilter("all");
    }
  }, [provinsiFilter]);

  // Load districts when city filter changes
  useEffect(() => {
    if (kotaFilter && kotaFilter !== "all") {
      loadDistricts(kotaFilter);
    } else {
      setDistricts([]);
      setKecamatanFilter("all");
    }
  }, [kotaFilter]);

  // Ensure kecamatan filter is disabled when province is "all"
  useEffect(() => {
    if (provinsiFilter === "all") {
      setKecamatanFilter("all");
    }
  }, [provinsiFilter]);

  const loadProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await getProvinces();
      if (response.success) {
        setProvinces(response.data);
      }
    } catch (error) {
      console.error("Failed to load provinces:", error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadCities = async (province: string) => {
    setLoadingCities(true);
    try {
      const response = await getCitiesByProvince(province);
      if (response.success) {
        setCities(response.data);
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  const loadDistricts = async (city: string) => {
    setLoadingDistricts(true);
    try {
      const response = await getDistrictsByCity(city);
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      console.error("Failed to load districts:", error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadSchools = async () => {
    setLoadingSchools(true);
    try {
      const response = await getSchools();
      if (response.success) {
        // Transform API data to component format
        const transformedData = response.data.map((school: ApiSchool) => ({
          id: school.id.toString(),
          nama: school.name,
          kecamatan: school.district,
          alamat: school.address,
          kota: school.city,
          provinsi: school.province,
          telepon: school.phone,
          email: school.email,
        }));
        setData(transformedData);
      }
    } catch (error) {
      console.error("Failed to load schools:", error);
    } finally {
      setLoadingSchools(false);
    }
  };

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
      return (
        matchesSearch && matchesKecamatan && matchesKota && matchesProvinsi
      );
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
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="min-w-30 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-1 h-8"
            >
              <Link
                href={`/dashboard/school-monitor/${item.nama}`}
                className="flex items-center"
              >
                <Eye className="w-3 h-3 mr-1" />
                Pantau Sekolah
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

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
          <Select
            value={kecamatanFilter}
            onValueChange={setKecamatanFilter}
            disabled={!kotaFilter || kotaFilter === "all" || loadingDistricts}
          >
            <SelectTrigger className="w-full sm:w-40">
              {loadingDistricts ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectValue placeholder="Pilih Kecamatan" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kecamatan</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={kotaFilter}
            onValueChange={setKotaFilter}
            disabled={
              !provinsiFilter || provinsiFilter === "all" || loadingCities
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              {loadingCities ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectValue placeholder="Pilih Kota/Kabupaten" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={provinsiFilter}
            onValueChange={setProvinsiFilter}
            disabled={loadingProvinces}
          >
            <SelectTrigger className="w-full sm:w-40">
              {loadingProvinces ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectValue placeholder="Pilih Provinsi" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Provinsi</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
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
    </div>
  );
}
