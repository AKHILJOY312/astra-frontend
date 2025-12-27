import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "@/redux/thunk/authThunks";
import type { AppDispatch } from "@/redux/store/store";

import { userRoutes, adminRoutes } from "@/routes//config";
import {
  AdminProtectedRoute,
  AdminPublicRoute,
  ProtectedRoute,
  PublicRoute,
} from "@/routes/RouteGuards";
import SocketInitializer from "@/components/organisms/user/common/SocketInitializer";
import GlobalLoader from "@/components/organisms/user/common/GlobalLoader";
import AuthLayout from "@/components/templates/auth-layout/AuthLayout";
import MainLayout from "@/components/templates/landing-layout/MainLayout";
import UserLayout from "@/components/templates/user-layout/UserLayout";
import AppLayout from "@/components/organisms/admin/layout/AppLayout";
import NotFound from "@/components/organisms/user/common/NotFound";

const pages = import.meta.glob("../components/pages/**/*.tsx");

type LazyModule = { default: ComponentType } | Record<string, ComponentType>;

const FallbackComponent: ComponentType = () => (
  <div>Component failed to load</div>
);

const safeLazy = (importer: () => Promise<unknown>) => {
  return lazy(async () => {
    const module = (await importer()) as LazyModule;

    const Component =
      "default" in module ? module.default : Object.values(module)[0];

    if (!Component) {
      console.error("No component exported from lazy module");
      return { default: FallbackComponent };
    }

    return { default: Component };
  });
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
            const importPath = `../components/pages/${r.filePath}${r.component}.tsx`;
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
              // default:
              //   element = element;
              //   break;
            }

            return <Route key={r.path} path={r.path} element={element} />;
          })}

          {/* ADMIN ROUTES - Nested under AppLayout */}
          <Route element={<AppLayout />}>
            {adminRoutes
              .filter((r) => r.layout === "admin" && r.path !== "/admin/login")
              .map((r) => {
                const importPath = `../components/pages/${r.filePath}${r.component}.tsx`;
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
                pages[`../components/pages/${r.filePath}${r.component}.tsx`];
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
