"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getMoodPattern } from "@/lib/api";
import { MoodPatternResponse } from "@/types/api";
import StudentDetailTabs from "@/components/data-display/StudentDetailTabs";

export default function MoodDetailPage() {
  const params = useParams();
  const username = params.student as string;

  const [selectedPeriod, setSelectedPeriod] = useState<string>("7");
  const [moodData, setMoodData] = useState<MoodPatternResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch data when component mounts
  useEffect(() => {
    if (username) {
      fetchMoodData();
    }
  }, [username, fetchMoodData]);

  // Get student name
  const studentName = moodData?.data.user.name || "Siswa";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Monitoring Siswa</h1>
        <p className="text-gray-600 mt-2">
          Sistem pelacakan data sekolah, kelas, dan siswa
        </p>
      </div>
      <StudentDetailTabs
        username={username}
        studentName={studentName}
        selectedPeriod={selectedPeriod}
        moodData={moodData}
        onPeriodChange={setSelectedPeriod}
      />
    </div>
  );
}
