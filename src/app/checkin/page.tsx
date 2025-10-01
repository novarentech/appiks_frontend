"use client";

import { CheckinAccessGuard } from "@/components/auth/guards/CheckinAccessGuard";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import CheckIn from "@/components/features/checkin/Checkin";

export default function CheckInPage() {
  return (
    <RoleGuard permissionType="checkin">
      <CheckinAccessGuard>
        <CheckIn />
      </CheckinAccessGuard>
    </RoleGuard>
  );
}
