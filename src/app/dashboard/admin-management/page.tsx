"use client";

import TuDataTable from "@/components/data-display/tables/TuDataTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function ClassDataPage() {
  return (
    <RoleGuard permissionType="admin-management">
      <ClassDataPageContent />
    </RoleGuard>
  );
}

function ClassDataPageContent() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Admin TU</h1>
        <p className="text-gray-600 mt-2">Kelola Data Admin TU</p>
      </div>
      <TuDataTable />
    </div>
  );
}
