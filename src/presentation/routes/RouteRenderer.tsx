// // src/presentation/routes/RouteRenderer.tsx
// import React from "react";

// // Map component name → lazy-loaded page
// const pageMap: Record<
//   string,
//   React.LazyExoticComponent<React.ComponentType<any>>
// > = {
//   Home: React.lazy(() => import("../pages/HomePage")),
//   SignUp: React.lazy(() => import("../pages/Auth/SignUpPage")),
//   VerifyEmail: React.lazy(() => import("../pages/Auth/VerifyEmailPage")),
//   LoginPage: React.lazy(() => import("../pages/Auth/LoginPage")),
//   ForgetPassword: React.lazy(() => import("../pages/Auth/ForgetPasswordPage")),
//   ResetPassword: React.lazy(() => import("../pages/Auth/ResetPasswordPage")),
//   ProjectPage: React.lazy(() => import("../pages/Project/ProjectPage")),
//   // Add more as needed
// };

// export const RouteRenderer: React.FC<{ component: string }> = ({
//   component,
// }) => {
//   const PageComponent = pageMap[component];

//   if (!PageComponent) {
//     return <div>Page "{component}" not found</div>;
//   }

//   return (
//     <React.Suspense fallback={<div>Loading...</div>}>
//       <PageComponent />
//     </React.Suspense>
//   );
// };
// v;
