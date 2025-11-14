import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "@/presentation/redux/thunk/authThunks";
import type { RootState, AppDispatch } from "@/presentation/redux/store/store";
import MainLayout from "@/presentation/components/user/layout/MainLayout";
import AuthLayout from "@/presentation/components/user/layout/AuthLayout";
import UserLayout from "@/presentation/components/user/layout/UserLayout";
import NotFound from "@/presentation/components/user/common/NotFound";
import { userRoutes, adminRoutes } from "@/presentation/routes/config";
import Home from "./pages/user/cover/Home";
import { useAppSelector } from "./redux/hooks";
const pages = import.meta.glob<{ default: React.ComponentType<any> }>(
  "./pages/**/*.tsx"
);

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/project" replace />;
  }

  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { admin } = useSelector((state: RootState) => state.adminAuth);
  const admin = true;
  return admin ? <>{children}</> : <Navigate to="/admin/signin" replace />;
};

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const allRoutes = [...userRoutes, ...adminRoutes];

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {allRoutes.map((r) => {
            const importPage = pages[`./pages/${r.filePath}${r.component}.tsx`];
            console.log(`./pages/${r.filePath}${r.component}.tsx`);
            if (!importPage) {
              console.warn(`Missing component for ${r.path}`);
              return null;
            }

            const LazyComponent = lazy(importPage);
            let element = <LazyComponent />;

            // 🟢 Handle protected routes
            if (r.protected) {
              element = r.path.startsWith("/admin") ? (
                <AdminProtectedRoute>{element}</AdminProtectedRoute>
              ) : (
                <ProtectedRoute>{element}</ProtectedRoute>
              );
            }
            // 🟣 Handle public (auth) routes
            else if (
              r.path === "/login" ||
              r.path === "/register" ||
              r.path === "/forget-password"
            ) {
              element = <PublicRoute>{element}</PublicRoute>;
            }

            switch (r.layout) {
              case "auth":
                element = <AuthLayout>{element}</AuthLayout>;
                break;
              case "main":
                element = <MainLayout>{element}</MainLayout>;
                break;
              case "app":
                element = <UserLayout>{element}</UserLayout>;
                break;
              // case "admin":
              //   element = <AppLayout>{element}</AppLayout>;
              //   break;
              default:
                break;
            }

            return <Route key={r.path} path={r.path} element={element} />;
          })}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
