"use client";

import { SelfHelp } from "@/components/features/self-help/SelfHelp";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function SelfHelpPage() {
  return (
    <RoleGuard permissionType="student-only">
      <SelfHelpPageContent />
    </RoleGuard>
  );
}

function SelfHelpPageContent() {
  return (
    <div className="min-h-screen max-w-6xl container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      <SelfHelp />
    </div>
  );
}
