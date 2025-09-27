import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login?next=/dashboard" replace />;

  switch (user.role) {
    case "SUPER_ADMIN":
      return <Navigate to="/dashboard/super" replace />;
    case "ADMIN":
      return <Navigate to="/dashboard/admin" replace />;
    case "ARTISAN":
      return <Navigate to="/dashboard/artisan" replace />;
    case "CLIENT":
    default:
      return <Navigate to="/dashboard/client" replace />;
  }
}
