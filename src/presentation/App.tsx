import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "@/presentation/redux/thunk/authThunks";
import type { AppDispatch } from "@/presentation/redux/store/store";

import MainLayout from "@/presentation/components/user/layout/MainLayout";
import AuthLayout from "@/presentation/components/user/layout/AuthLayout";
import UserLayout from "@/presentation/components/user/layout/UserLayout";
import AppLayout from "@/presentation/components/admin/layout/AppLayout";
import NotFound from "@/presentation/components/user/common/NotFound";
import { userRoutes, adminRoutes } from "@/presentation/routes/config";

import {
  AdminProtectedRoute,
  AdminPublicRoute,
  ProtectedRoute,
  PublicRoute,
} from "./routes/RouteGuards";
import GlobalLoader from "./components/user/common/GlobalLoader";
import SocketInitializer from "./components/user/common/SocketInitializer";

const pages = import.meta.glob("./pages/**/*.tsx");

const safeLazy = (importer: () => Promise<any>) => {
  return lazy(() =>
    importer().then((module: any) => {
      const Component = module.default || Object.values(module)[0];
      if (!Component) {
        console.error("No component exported from", importer);
        return { default: () => <div>Component failed to load</div> };
      }
      return { default: Component };
    })
  );
};

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <SocketInitializer />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-2xl">
            <GlobalLoader />
          </div>
        }
      >
        <Routes>
          {/* USER ROUTES */}
          {userRoutes.map((r) => {
            const importPath = `./pages/${r.filePath}${r.component}.tsx`;
            const importPage = pages[importPath];

            if (!importPage) {
              console.warn("Missing page:", importPath);
              return null;
            }

            const LazyComponent = safeLazy(importPage);
            let element: React.ReactNode = <LazyComponent />;

            if (r.protected) {
              element = <ProtectedRoute>{element}</ProtectedRoute>;
            } else if (
              ["/login", "/register", "/forget-password"].includes(r.path)
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
              default:
                element = element;
                break;
            }

            return <Route key={r.path} path={r.path} element={element} />;
          })}

          {/* ADMIN ROUTES - Nested under AppLayout */}
          <Route element={<AppLayout />}>
            {adminRoutes
              .filter((r) => r.layout === "admin" && r.path !== "/admin/login")
              .map((r) => {
                const importPath = `./pages/${r.filePath}${r.component}.tsx`;
                const importPage = pages[importPath];

                if (!importPage) {
                  console.warn("Admin page missing:", importPath);
                  return null;
                }

                const LazyComponent = safeLazy(importPage);
                let element = <LazyComponent />;

                if (r.path !== "/admin/login") {
                  element = (
                    <AdminProtectedRoute>{element}</AdminProtectedRoute>
                  );
                }

                const nestedPath = r.path;

                return (
                  <Route key={r.path} path={nestedPath} element={element} />
                );
              })}
          </Route>

          {/* Admin Sign in (outside layout) */}
          {adminRoutes
            .filter((r) => r.path === "/admin/login")
            .map((r) => {
              const importPage =
                pages[`./pages/${r.filePath}${r.component}.tsx`];
              if (!importPage) return null;

              const LazyComponent = safeLazy(importPage);
              return (
                <Route
                  key={r.path}
                  path={r.path}
                  element={
                    <AdminPublicRoute>
                      <LazyComponent />
                    </AdminPublicRoute>
                  }
                />
              );
            })}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
