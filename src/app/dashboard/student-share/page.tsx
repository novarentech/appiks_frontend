"use client";

import ConfidentPanel from "@/components/dashboard/panels/ConfidentPanel";
import ConfidentTable from "@/components/data-display/tables/ConfidentTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function DashboardDataSiswaPage() {
  return (
    <RoleGuard permissionType="student-share">
      <DashboardDataSiswaPageContent />
    </RoleGuard>
  );
}

function DashboardDataSiswaPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Curhatan Siswa</h1>
        <p className="text-gray-600 mt-2">Kelola dan tanggapi curhatan siswa</p>
      </div>

      {/* Panel Statistik */}
      <ConfidentPanel />

      {/* Table Curhatan Siswa */}
      <ConfidentTable />
    </div>
  );
}
