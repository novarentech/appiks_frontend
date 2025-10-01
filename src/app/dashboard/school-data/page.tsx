"use client";

import HeadTeacherPanel from "@/components/dashboard/panels/HeadTeacherPanel";
import SchoolDataTable from "@/components/data-display/tables/SchoolDataTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function SchoolDataPage() {
  return (
    <RoleGuard permissionType="school-data">
      <SchoolDataPageContent />
    </RoleGuard>
  );
}

function SchoolDataPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Sekolah</h1>
        <p className="text-gray-600 mt-2">Lihat data akun pengguna Apppiks</p>
      </div>
      <HeadTeacherPanel />
      <SchoolDataTable />
    </div>
  );
}
