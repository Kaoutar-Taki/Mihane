import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import type { Role } from "@/auth/AuthContext";

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: Role;
  requiredRoles?: Role[];
  fallbackPath?: string;
}

export default function RouteGuard({ 
  children, 
  requiredRole, 
  requiredRoles, 
  fallbackPath = "/login" 
}: RouteGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`${fallbackPath}?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check single required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check multiple allowed roles
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Specific role guards for convenience
export function SuperAdminGuard({ children }: { children: ReactNode }) {
  return <RouteGuard requiredRole="SUPER_ADMIN">{children}</RouteGuard>;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  return <RouteGuard requiredRoles={["SUPER_ADMIN", "ADMIN"]}>{children}</RouteGuard>;
}

export function ArtisanGuard({ children }: { children: ReactNode }) {
  return <RouteGuard requiredRole="ARTISAN">{children}</RouteGuard>;
}

export function ClientGuard({ children }: { children: ReactNode }) {
  return <RouteGuard requiredRole="CLIENT">{children}</RouteGuard>;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  return <RouteGuard>{children}</RouteGuard>;
}
