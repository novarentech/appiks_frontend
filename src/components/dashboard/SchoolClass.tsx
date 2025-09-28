"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Users, Search } from "lucide-react";
import { SchoolRoomsResponse, SchoolRoom } from "@/types/api";
import { FaChalkboardTeacher } from "react-icons/fa";
import Link from "next/link";

interface SchoolClassProps {
  schoolName: string;
  roomsData: SchoolRoomsResponse["data"] | null;
  searchTerm: string;
  selectedLevel: string;
  onSearchChange: (term: string) => void;
  onLevelChange: (level: string) => void;
  availableLevels: string[];
  filteredRooms: SchoolRoom[];
}

export default function SchoolClass({
  schoolName,
  searchTerm,
  selectedLevel,
  onSearchChange,
  onLevelChange,
  availableLevels,
  filteredRooms,
}: SchoolClassProps) {
  return (
    <>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari kelas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedLevel} onValueChange={onLevelChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Pilih tingkat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tingkat</SelectItem>
            {availableLevels.map((level) => (
              <SelectItem key={level} value={level}>
                Tingkat {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {filteredRooms.map((room: SchoolRoom) => (
          <Card key={room.id}>
            <CardHeader className="flex items-center gap-3 text-xl">
              <span className="p-2 bg-indigo-200 text-indigo-500 rounded-md">
                <FaChalkboardTeacher />
              </span>
              <CardTitle>{room.mention}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Users className="w-4 h-4" />
                <span className="text-sm">{room.students_count} Siswa</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Link
                  href={`/dashboard/school-monitor/${schoolName}/${room.code}`}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  Lihat Detail
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
