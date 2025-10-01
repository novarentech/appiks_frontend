"use client";

import { EduContent } from "@/components/features/edu-content/EduContent";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function EduContentPage() {
  return (
    <RoleGuard permissionType="student-only">
      <EduContentPageContent />
    </RoleGuard>
  );
}

function EduContentPageContent() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      <EduContent />
    </div>
  );
}
