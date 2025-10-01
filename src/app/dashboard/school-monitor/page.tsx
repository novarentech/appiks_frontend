"use client";

import SchoolMonitorTable from "@/components/data-display/tables/SchoolMonitorTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function SchoolMonitorPage() {
  return (
    <RoleGuard permissionType="school-monitor">
      <SchoolMonitorPageContent />
    </RoleGuard>
  );
}

function SchoolMonitorPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Monitoring Sekolah</h1>
        <p className="text-gray-600 mt-2">
          Sistem pelacakan data sekolah, kelas, dan siswa
        </p>
      </div>
      <SchoolMonitorTable />
    </div>
  );
}
