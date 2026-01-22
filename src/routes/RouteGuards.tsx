import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? (
    <Navigate to="/projects" replace />
  ) : (
    <>{children}</>
  );
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AdminProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, loading, role } = useAppSelector(
    (state) => state.auth
  );

  // Optional: Show loading while checking
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading admin access...</div>
      </div>
    );
  }

  // Main check: must be logged in AND have isAdmin: true
  const isAdmin = isAuthenticated && role === "admin";

  // useEffect(() => {
  //   if (!isAdmin) {
  //     navigate("/admin/login", { replace: true });
  //   }
  // }, [isAdmin, navigate]);

  // If not admin → redirect immediately
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const AdminPublicRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, role, loading } = useAppSelector((s) => s.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Checking...
      </div>
    );
  }

  // If already logged in *and* admin, block login page
  if (isAuthenticated && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
