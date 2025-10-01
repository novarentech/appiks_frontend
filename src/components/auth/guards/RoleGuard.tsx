"use client";

import { useRoleAccess, type AppRole } from "@/hooks/useRoleAccess";

interface RoleGuardProps {
  permissionType: keyof typeof import("@/hooks/useRoleAccess").ROLE_PERMISSIONS;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  LoadingComponent?: React.ComponentType;
}

export function RoleGuard({
  permissionType,
  children,
  fallback,
  LoadingComponent,
}: RoleGuardProps) {
  const { hasAccess, isLoading } = useRoleAccess(permissionType);

  // Show loading state while checking access
  if (isLoading) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback if access denied
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default fallback - will be redirected by the hook
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  // Render children if access granted
  return <>{children}</>;
}

// Simplified role guard components for common use cases
interface SimpleRoleGuardProps {
  allowedRoles: AppRole[];
  children: React.ReactNode;
  requireVerification?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
  LoadingComponent?: React.ComponentType;
}

export function SimpleRoleGuard({
  allowedRoles,
  children,
  fallback,
  LoadingComponent,
}: SimpleRoleGuardProps) {
  // Create a custom permission type for this specific use case
  const customPermissionType = `custom-${allowedRoles.join(
    "-"
  )}` as keyof typeof import("@/hooks/useRoleAccess").ROLE_PERMISSIONS;

  return (
    <RoleGuard
      permissionType={customPermissionType}
      fallback={fallback}
      LoadingComponent={LoadingComponent}
    >
      {children}
    </RoleGuard>
  );
}

// Specific guard components for common patterns
export function StudentGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard permissionType="student-only">{children}</RoleGuard>;
}

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard permissionType="dashboard">{children}</RoleGuard>;
}
