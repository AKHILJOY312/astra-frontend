import type { RouteItem } from "./routeTypes";

export const userRoutes: RouteItem[] = [
  {
    path: "/",
    component: "Home",
    exact: true,
    layout: "main",
    filePath: "user/cover/",
  },
  {
    path: "/register",
    component: "SignUp",
    exact: true,
    layout: "auth",
    filePath: "user/auth/",
  },
  {
    path: "/verify-email",
    component: "VerifyEmail",
    exact: true,
    layout: "auth", //auth,main,none,
    filePath: "user/auth/",
  },
  {
    path: "/login",
    component: "LoginPage",
    layout: "auth",
    filePath: "user/auth/",
  },
  {
    path: "/forget-password",
    component: "ForgetPassword",
    layout: "auth",
    filePath: "user/auth/",
  },
  {
    path: "/reset-password",
    component: "ResetPassword",
    exact: true,
    protected: false,
    layout: "auth",
    filePath: "user/auth/",
  },
  {
    path: "/project",
    component: "ProjectPage",
    exact: true,
    protected: true,
    layout: "app",
    filePath: "user/project/",
  },
  {
    path: "/success",
    component: "AuthSuccess",
    layout: "none",
    filePath: "user/auth/",
  },

  //  // {
  //   path: '/projects/:id',
  //   component: 'ProjectPage',
  //   exact: true,
  //   protected: true,
  // },
  // {
  //   path: '/',
  //   component: 'Dashboard',
  //   exact: true,
  //   protected: true,
  // },
];

export const adminRoutes: RouteItem[] = [
  // {
  //   path: "/admin/profile",
  //   component: "UserProfiles",
  //   layout: "admin",
  //   protected: true,
  // },
  {
    path: "/admin/login",
    component: "SignIn",
    layout: "admin",
    filePath: "admin/AuthPages/",
  },
  {
    path: "/admin/dashboard",
    component: "Home",
    layout: "admin",
    protected: true,
    filePath: "admin/Dashboard/",
  },
  {
    path: "admin/forgot-password",
    component: "Home",
    layout: "admin",
    protected: true,
    filePath: "admin/Dashboard/",
  },
];
