"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getMoodPattern, getStudentMoodExport } from "@/lib/api";
import { MoodPatternResponse } from "@/types/api";
import MoodChart from "@/components/dashboard/MoodChart";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { toast } from "sonner";

export default function MoodDetailPage() {
  return (
    <RoleGuard permissionType="mood-detail">
      <MoodDetailPageContent />
    </RoleGuard>
  );
}

function MoodDetailPageContent() {
  const params = useParams();
  const username = params.username as string;

  const [selectedPeriod, setSelectedPeriod] = useState<string>("7");
  const [moodData, setMoodData] = useState<MoodPatternResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Fetch mood pattern data
  const fetchMoodData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const type = selectedPeriod === "7" ? "weekly" : "monthly";
      const response = await getMoodPattern(username, type);
      setMoodData(response);
    } catch (err) {
      setError("Gagal memuat data mood. Silakan coba lagi.");
      console.error("Error fetching mood data:", err);
    } finally {
      setLoading(false);
    }
  }, [username, selectedPeriod]);

  // Fetch data when component mounts or when period changes
  useEffect(() => {
    if (username) {
      fetchMoodData();
    }
  }, [username, selectedPeriod, fetchMoodData]);


  // Get current mood stats
  const currentMoodStats = moodData?.data.recap || {
    sad: 0,
    neutral: 0,
    angry: 0,
    happy: 0,
  };

  // Get student name
  const studentName = moodData?.data.user.name || "Siswa";

  // Mood analysis based on mean
  const getMoodAnalysis = () => {
    const mean = moodData?.data.mean || "neutral";

    if (mean === "insecure" || mean === "sad" || mean === "angry") {
      return {
        trend: "tidak aman",
        description: `Mood rata-rata siswa ${studentName} tercatat berada di kategori tidak aman dalam ${
          selectedPeriod === "7" ? "7 hari" : "30 hari"
        } terakhir. Hal ini dapat menjadi tanda bahwa siswa sedang mengalami tekanan emosional atau perasaan negatif yang cukup serius. Disarankan untuk menghubungi siswa secara personal, menawarkan sesi konseling secara private, atau memantau perubahan mood di minggu berikutnya.`,
      };
    } else {
      return {
        trend: "aman",
        description: `Mood rata-rata siswa ${studentName} tercatat berada di kategori aman dalam ${
          selectedPeriod === "7" ? "7 hari" : "30 hari"
        } terakhir. Hal ini menunjukkan bahwa siswa memiliki kondisi emosional yang stabil. Tetap pantau perkembangan mood siswa untuk memastikan kondisinya tetap baik.`,
      };
    }
  };

  const moodAnalysis = getMoodAnalysis();

  // Handle download functionality
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Get the actual username from mood data
      const actualUsername = moodData?.data.user.username || username;
      const type = selectedPeriod === "7" ? "weekly" : "monthly";
      
      // Get the export URL from API
      const response = await getStudentMoodExport(actualUsername, type);
      
      if (response.success && response.data?.url) {
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = response.data.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Extract filename from URL or create a default one
        const urlParts = response.data.url.split('/');
        const filename = urlParts[urlParts.length - 1] || `student-mood-${actualUsername}-${type}-${new Date().toISOString().split('T')[0]}.xlsx`;
        
        link.download = filename;
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Data mood siswa berhasil diunduh");
      } else {
        throw new Error(response.message || "Gagal mendapatkan URL export");
      }
    } catch (error) {
      console.error("Error downloading student mood data:", error);
      toast.error(error instanceof Error ? error.message : "Gagal mengunduh data mood siswa");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data mood...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMoodData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <MoodChart
      title={`Lihat Pola Mood ${studentName}`}
      subtitle="Laporan Pola Mood"
      selectedPeriod={selectedPeriod}
      moodData={moodData?.data.moods || []}
      currentMoodStats={currentMoodStats}
      moodAnalysis={moodAnalysis}
      onPeriodChange={setSelectedPeriod}
      showDownloadButton={true}
      onDownload={handleDownload}
      isDownloading={isDownloading}
    />
  );
}
