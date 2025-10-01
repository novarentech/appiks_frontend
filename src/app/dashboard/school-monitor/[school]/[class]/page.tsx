"use client";

import ClassDetailTable from "@/components/data-display/tables/ClassDetailTables";
import { useParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function ClassDataPage() {
  return (
    <RoleGuard permissionType="school-monitor">
      <ClassDataPageContent />
    </RoleGuard>
  );
}

function ClassDataPageContent() {
  const params = useParams();
  const classCode = params.class as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Monitoring Kelas</h1>
        <p className="text-gray-600 mt-2">
          Sistem pelacakan data sekolah, kelas, dan siswa
        </p>
      </div>

      <ClassDetailTable roomCode={classCode} />
    </div>
  );
}
