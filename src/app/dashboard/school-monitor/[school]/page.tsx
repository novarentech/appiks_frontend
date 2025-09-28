"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getSchoolMoodTrends, getSchoolRooms } from "@/lib/api";
import { SchoolMoodTrendsResponse, SchoolRoomsResponse, SchoolRoom } from "@/types/api";
import SchoolChart from "@/components/dashboard/SchoolChart";
import SchoolClass from "@/components/dashboard/SchoolClass";

export default function SchoolMonitorDetailPage() {
  const params = useParams();
  const schoolName = params.school as string;

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

      if (!schoolName) {
        setError("Nama sekolah tidak valid.");
        return;
      }

      const response = await getSchoolMoodTrends(schoolName, type);

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
  }, [schoolName, selectedPeriod]);

  // Fetch school rooms data
  const fetchRoomsData = useCallback(async () => {
    try {
      if (!schoolName) {
        setError("Nama sekolah tidak valid.");
        return;
      }

      const response = await getSchoolRooms(schoolName);

      if (response.success) {
        setRoomsData(response.data);
      } else {
        setError("Gagal memuat data kelas sekolah. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Gagal memuat data kelas sekolah. Silakan coba lagi.");
      console.error("Error fetching school rooms data:", err);
    }
  }, [schoolName]);

  // Fetch data when component mounts or when period changes
  useEffect(() => {
    if (schoolName) {
      fetchMoodData();
      fetchRoomsData();
    }
  }, [schoolName, selectedPeriod, fetchMoodData, fetchRoomsData]);


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

  // Get display school name (fallback to URL parameter if API data not available)
  const displaySchoolName = schoolData?.name || schoolName || "Sekolah";

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
        description: `Mood rata-rata siswa di ${displaySchoolName} tercatat berada di kategori tidak aman dalam ${
          selectedPeriod === "7" ? "7 hari" : "30 hari"
        } terakhir. Hal ini dapat menjadi tanda bahwa banyak siswa sedang mengalami tekanan emosional atau perasaan negatif yang cukup serius. Disarankan untuk meningkatkan perhatian dan dukungan psikologis di sekolah.`,
      };
    } else {
      return {
        trend: "aman",
        description: `Mood rata-rata siswa di ${displaySchoolName} tercatat berada di kategori aman dalam ${
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
      <SchoolChart
        schoolName={displaySchoolName}
        selectedPeriod={selectedPeriod}
        moodData={moodData}
        currentMoodStats={currentMoodStats}
        moodAnalysis={moodAnalysis}
        onPeriodChange={setSelectedPeriod}
      />

      <SchoolClass
        schoolName={schoolName}
        roomsData={roomsData}
        searchTerm={searchTerm}
        selectedLevel={selectedLevel}
        onSearchChange={setSearchTerm}
        onLevelChange={setSelectedLevel}
        availableLevels={availableLevels}
        filteredRooms={filteredRooms}
      />
    </>
  );
}
