"use client";

import { Survey } from "@/components/features/survey/Survey";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function SurveyPage() {
  return (
    <RoleGuard permissionType="student-only">
      <Survey />
    </RoleGuard>
  );
}
