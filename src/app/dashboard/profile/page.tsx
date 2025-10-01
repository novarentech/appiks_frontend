"use client";

import { StudentProfile } from "@/components/features/profile/StudentProfile";
import Profile from "@/components/features/profile/Profile";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function ProfilePageComponent() {
  return (
    <RoleGuard permissionType="profile">
      <ProfilePageContent />
    </RoleGuard>
  );
}

function ProfilePageContent() {
  const { user } = useAuth();

  // Show different profile components based on user role
  if (user?.role === "student") {
    return <StudentProfile />;
  }

  // For non-student roles (teacher, counselor, admin, etc.)
  return <Profile />;
}
