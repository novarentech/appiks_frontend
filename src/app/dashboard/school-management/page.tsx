"use client";

import SuperSchoolDataTable from "@/components/data-display/tables/SuperSchoolDataTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function ClassDataPage() {
  return (
    <RoleGuard permissionType="school-management">
      <ClassDataPageContent />
    </RoleGuard>
  );
}

function ClassDataPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Sekolah</h1>
        <p className="text-gray-600 mt-2">Kelola Data Sekolah</p>
      </div>
      
      <SuperSchoolDataTable />
    </div>
  );
}
