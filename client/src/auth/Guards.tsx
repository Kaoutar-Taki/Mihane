import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "./AuthContext";
import type { ReactElement } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export function RequireAuth({ 
  children, 
  fallback 
}: { 
  children: ReactElement;
  fallback?: ReactElement;
}) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  
  if (loading) {
    return fallback || (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`}
        replace
      />
    );
  }
  
  return children;
}

export function RequireRole({
  role,
  children,
  fallback,
  unauthorizedFallback
}: {
  role: Role;
  children: ReactElement;
  fallback?: ReactElement;
  unauthorizedFallback?: ReactElement;
}) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  
  if (loading) {
    return fallback || (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`}
        replace
      />
    );
  }
  
  if (user.role !== role) {
    return unauthorizedFallback || (
      <Navigate to="/" replace state={{ denied: true, from: loc }} />
    );
  }
  
  return children;
}
