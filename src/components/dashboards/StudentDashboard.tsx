"use client";

import { UserProfile } from "@/components/auth/UserProfile";
import { useAuth } from "@/hooks/useAuth";

export function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name || user?.username}
        </p>
      </div>

      <div className="flex justify-center">
        <UserProfile />
      </div>
    </div>
  );
}
