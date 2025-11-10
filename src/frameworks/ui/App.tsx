import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/frameworks/ui/redux/store/index";
import routes from "@/interface-adapters/routes/config.ts";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import { loadUser } from "./redux/slices/authSlice";
import type { AppDispatch } from "@/frameworks/ui/redux/store/index";
import GlobalLoader from "./common/GlobalLoader";
import { adminRoutes } from "@/frameworks/ui/routes/AdminRoutes";
import NotFound from "./common/NotFound";

const pages = import.meta.glob<{ default: React.ComponentType<any> }>(
  "./pages/**/*.tsx"
);

// const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   // const { admin } = useSelector((state: RootState) => state.adminAuth);
//   // if (!admin) return <Navigate to="/admin/login" replace />;
//   return children;
// };

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    console.log("Available pages:", Object.keys(pages));
  }, []);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          {/*  Admin Routes */}
          {adminRoutes}

          {routes.map((routeItem) => {
            const importPage = pages[`./pages/user/${routeItem.component}.tsx`];

            if (!importPage) {
              console.error(`Component not found: ${routeItem.component}`);
              return null;
            }
            const LazyComponent = lazy(importPage);

            let element = <LazyComponent />;

            // Wrap with ProtectedRoute if needed
            if (routeItem.protected) {
              element = <ProtectedRoute>{element}</ProtectedRoute>;
            }

            // Wrap with layout
            if (routeItem.layout === "auth") {
              element = <AuthLayout>{element}</AuthLayout>;
            } else if (routeItem.layout === "main") {
              // default to main layout
              element = <MainLayout>{element}</MainLayout>;
            }

            return (
              <Route
                key={routeItem.path}
                path={routeItem.path}
                element={element}
              />
            );
          })}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
