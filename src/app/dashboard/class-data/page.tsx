"use client";

import ClassPanel from "@/components/dashboard/panels/ClassPanel";
import ClassDataTable from "@/components/data-display/tables/ClassDataTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function ClassDataPage() {
  return (
    <RoleGuard permissionType="class-data">
      <ClassDataPageContent />
    </RoleGuard>
  );
}

function ClassDataPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Kelas</h1>
        <p className="text-gray-600 mt-2">Kelola Data Kelas</p>
      </div>
      <ClassPanel />

      <ClassDataTable />
    </div>
  );
}
