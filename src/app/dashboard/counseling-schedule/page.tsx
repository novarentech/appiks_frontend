"use client";

import CounselingSchedulePanel from "@/components/dashboard/panels/CouncelingSchedulePanel";
import CounselingScheduleTable from "@/components/data-display/tables/CounselingScheduleTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function DashboardDataSiswaPage() {
  return (
    <RoleGuard permissionType="counseling-schedule">
      <DashboardDataSiswaPageContent />
    </RoleGuard>
  );
}

function DashboardDataSiswaPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Jadwal Konseling</h1>
        <p className="text-gray-600 mt-2">
          Kelola dan atur jadwal konseling siswa
        </p>
      </div>

      {/* Panel Statistik */}
      <CounselingSchedulePanel />

      {/* Table Jadwal Konseling */}
      <CounselingScheduleTable />
    </div>
  );
}
