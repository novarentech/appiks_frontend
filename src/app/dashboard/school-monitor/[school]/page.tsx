"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Users, Search } from "lucide-react";
import { getSchoolMoodTrends, getSchoolRooms } from "@/lib/api";
import { SchoolMoodTrendsResponse, SchoolRoomsResponse, SchoolRoom } from "@/types/api";
import { FaChalkboardTeacher } from "react-icons/fa";
import Link from "next/link";

// Custom Tooltip component for the chart
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      moodLabel: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="font-medium">{data.date}</p>
        <p className="text-sm">Mood: {data.moodLabel}</p>
      </div>
    );
  }
  return null;
};

export default function SchoolMonitorDetailPage() {
  const params = useParams();
  const schoolId = params.school as string;

  const [selectedPeriod, setSelectedPeriod] = useState<string>("7");
  const [moodData, setMoodData] = useState<
    SchoolMoodTrendsResponse["data"] | null
  >(null);

  const [schoolData, setSchoolData] = useState<
    SchoolMoodTrendsResponse["data"]["school"] | null
  >(null);
  const [roomsData, setRoomsData] = useState<SchoolRoomsResponse["data"] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch school mood trend data
  const fetchMoodData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const type = selectedPeriod === "7" ? "weekly" : "monthly";
      const schoolIdNum = parseInt(schoolId, 10);

      if (isNaN(schoolIdNum)) {
        setError("ID sekolah tidak valid.");
        return;
      }

      const response = await getSchoolMoodTrends(schoolIdNum, type);

      if (response.success) {
        setMoodData(response.data);
        setSchoolData(response.data.school);
      } else {
        setError("Gagal memuat data mood sekolah. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Gagal memuat data mood sekolah. Silakan coba lagi.");
      console.error("Error fetching school mood data:", err);
    } finally {
      setLoading(false);
    }
  }, [schoolId, selectedPeriod]);

  // Fetch school rooms data
  const fetchRoomsData = useCallback(async () => {
    try {
      const schoolIdNum = parseInt(schoolId, 10);

      if (isNaN(schoolIdNum)) {
        setError("ID sekolah tidak valid.");
        return;
      }

      const response = await getSchoolRooms(schoolIdNum);

      if (response.success) {
        setRoomsData(response.data);
      } else {
        setError("Gagal memuat data kelas sekolah. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Gagal memuat data kelas sekolah. Silakan coba lagi.");
      console.error("Error fetching school rooms data:", err);
    }
  }, [schoolId]);

  // Fetch data when component mounts or when period changes
  useEffect(() => {
    if (schoolId) {
      fetchMoodData();
      fetchRoomsData();
    }
  }, [schoolId, selectedPeriod, fetchMoodData, fetchRoomsData]);

  // Transform mood data for chart
  const getCurrentData = () => {
    if (!moodData?.moods) return [];

    return moodData.moods.map((mood) => {
      let moodValue = 0;
      let moodLabel = "";

      switch (mood.status) {
        case "sad":
          moodValue = 1;
          moodLabel = "Sedih";
          break;
        case "angry":
          moodValue = 2;
          moodLabel = "Marah";
          break;
        case "neutral":
          moodValue = 3;
          moodLabel = "Netral";
          break;
        case "happy":
          moodValue = 4;
          moodLabel = "Gembira";
          break;
        default:
          moodValue = 3;
          moodLabel = "Netral";
      }

      return {
        date: new Date(mood.recorded).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        mood: moodValue,
        moodLabel,
        originalDate: mood.recorded,
        total: mood.total,
      };
    });
  };

  // Calculate current mood stats from moods data
  const currentMoodStats = useMemo(() => {
    if (!moodData?.moods) {
      return { sad: 0, neutral: 0, angry: 0, happy: 0 };
    }

    const stats = { sad: 0, neutral: 0, angry: 0, happy: 0 };
    moodData.moods.forEach((mood) => {
      if (mood.status === "sad") stats.sad += mood.total;
      if (mood.status === "angry") stats.angry += mood.total;
      if (mood.status === "neutral") stats.neutral += mood.total;
      if (mood.status === "happy") stats.happy += mood.total;
    });

    return stats;
  }, [moodData?.moods]);

  // Get school name
  const schoolName = schoolData?.name || "Sekolah";

  // Mood analysis based on mood distribution
  const getMoodAnalysis = () => {
    const total =
      currentMoodStats.happy +
      currentMoodStats.neutral +
      currentMoodStats.sad +
      currentMoodStats.angry;
    const negativePercentage =
      ((currentMoodStats.sad + currentMoodStats.angry) / total) * 100;

    if (negativePercentage > 40) {
      return {
        trend: "tidak aman",
        description: `Mood rata-rata siswa di ${schoolName} tercatat berada di kategori tidak aman dalam ${
          selectedPeriod === "7" ? "7 hari" : "30 hari"
        } terakhir. Hal ini dapat menjadi tanda bahwa banyak siswa sedang mengalami tekanan emosional atau perasaan negatif yang cukup serius. Disarankan untuk meningkatkan perhatian dan dukungan psikologis di sekolah.`,
      };
    } else {
      return {
        trend: "aman",
        description: `Mood rata-rata siswa di ${schoolName} tercatat berada di kategori aman dalam ${
          selectedPeriod === "7" ? "7 hari" : "30 hari"
        } terakhir. Hal ini menunjukkan bahwa kondisi emosional siswa secara umum stabil. Tetap pantau perkembangan mood siswa untuk memastikan kondisinya tetap baik.`,
      };
    }
  };

  // Filter rooms based on search term and selected level
  const filteredRooms = useMemo(() => {
    if (!roomsData) return [];
    
    return roomsData.filter((room: SchoolRoom) => {
      const matchesSearch = searchTerm === "" || 
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.mention.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = selectedLevel === "all" || room.level === selectedLevel;
      
      return matchesSearch && matchesLevel;
    });
  }, [roomsData, searchTerm, selectedLevel]);

  // Get unique levels for filter dropdown
  const availableLevels = useMemo(() => {
    if (!roomsData) return [];
    const levels = [...new Set(roomsData.map((room: SchoolRoom) => room.level))];
    return levels.sort();
  }, [roomsData]);

  const moodAnalysis = getMoodAnalysis();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
          <p className="mt-4 text-gray-600">Memuat data mood sekolah...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchMoodData}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* School Chart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <CardTitle className="text-xl md:text-2xl font-semibold">
            Monitor Mood {schoolName}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Laporan Pola Mood Sekolah
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 hari terakhir</SelectItem>
              <SelectItem value="30">30 hari terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="space-y-6">
          {/* Mood Chart */}
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getCurrentData()}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  domain={[0.5, 4.5]}
                  tickFormatter={(value) => {
                    if (value === 1) return "Sedih";
                    if (value === 2) return "Marah";
                    if (value === 3) return "Netral";
                    if (value === 4) return "Gembira";
                    return "";
                  }}
                  ticks={[1, 2, 3, 4]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="linear"
                  dataKey="mood"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: "#4f46e5", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#4f46e5",
                    strokeWidth: 2,
                    stroke: "#ffffff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Current Period Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD GEMBIRA</div>
              <div className="text-2xl font-bold text-green-600">
                {currentMoodStats.happy}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD SEDIH</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentMoodStats.sad}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD NETRAL</div>
              <div className="text-2xl font-bold text-gray-600">
                {currentMoodStats.neutral}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD MARAH</div>
              <div className="text-2xl font-bold text-red-600">
                {currentMoodStats.angry}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-700 mb-2.5">
              MOOD RATA-RATA{" "}
              {selectedPeriod === "7" ? "MINGGU INI" : "BULAN INI"}
            </p>
            <p
              className={`ml-2 flex items-center justify-center space-x-2 ${
                moodAnalysis.trend === "tidak aman"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-xs inline-block mr-2 ${
                  moodAnalysis.trend === "tidak aman"
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              ></span>
              <span>
                &ldquo;
                {moodAnalysis.trend === "tidak aman" ? "Tidak Aman" : "Aman"}
                &rdquo;
              </span>
            </p>
          </div>

          {/* Analysis */}
          <div
            className={`border rounded-lg p-4 ${
              moodAnalysis.trend === "tidak aman"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <p
              className={`text-sm leading-relaxed text-center ${
                moodAnalysis.trend === "tidak aman"
                  ? "text-red-700"
                  : "text-green-700"
              }`}
            >
              {moodAnalysis.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* School Class */}
      <>
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative w-full sm:w-1/5">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
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
                    href={`/dashboard/school-monitor/${schoolId}/${room.id}`}
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
    </>
  );
}
