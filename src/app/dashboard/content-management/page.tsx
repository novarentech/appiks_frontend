"use client";

import ContentManagementPanel from "@/components/dashboard/panels/ContentManagementPanel";
import { ContentManagementTable } from "@/components/data-display/tables/ContentManagementTable";
import { useState } from "react";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function ContentManagementPage() {
  return (
    <RoleGuard permissionType="content-management">
      <ContentManagementPageContent />
    </RoleGuard>
  );
}

function ContentManagementPageContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Konten Edukasi</h1>
        <p className="text-gray-600 mt-2">Management artikel dan video </p>
      </div>

      <ContentManagementPanel refreshTrigger={refreshTrigger} />

      <ContentManagementTable refreshData={refreshData} />
    </div>
  );
}
