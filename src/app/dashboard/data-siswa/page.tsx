"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StudentDataTable from "@/components/components/tables/StudentDataTable";
import TeacherPanel from "@/components/components/panel/teacher-panel";

interface Student {
  id: number;
  name: string;
  nisn: string;
  kelas: string;
  statusMood: string;
  detailMood: string;
  aksi: string;
}

export default function DashboardDataSiswaPage() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isVerified)) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && user.role !== "teacher") {
      router.push("/dashboard");
      return;
    }
  }, [isLoading, isAuthenticated, isVerified, user, router]);

  const handleStudentSelect = (student: Student) => {
    // Navigate to mood pattern page for the selected student
    router.push(
      `/dashboard/lihat-pola-mood/${encodeURIComponent(
        student.name.toLowerCase().replace(/\s+/g, "-")
      )}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isVerified || !user || user.role !== "teacher") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Siswa</h1>
        <p className="text-gray-600 mt-2">
          Pantau mood siswa, interaksi, dan laporan dengan mudah.
        </p>
      </div>

      {/* Metrics Panel */}
      <TeacherPanel />

      {/* Student Data Table */}
      <StudentDataTable onStudentSelect={handleStudentSelect} />
    </div>
  );
}
