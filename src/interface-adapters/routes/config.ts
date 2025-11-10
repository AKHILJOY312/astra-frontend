import type { RouteItem } from "./routeTypes";

const routes: RouteItem[] = [
  // {
  //   path: ["/", "/home"],
  //   component: "Home",
  //   exact: true,
  // },

  {
    path: "/",
    component: "Home",
    exact: true,
    layout: "main",
  },
  {
    path: "/register",
    component: "SignUp",
    exact: true,
    layout: "auth",
  },
  {
    path: "/verify-email",
    component: "VerifyEmail",
    exact: true,
    layout: "auth", //auth,main,none
  },
  {
    path: "/login",
    component: "LoginPage",
    exact: true,
    layout: "auth",
  },
  {
    path: "/forget-password",
    component: "ForgetPassword",
    exact: true,
    layout: "auth",
  },
  {
    path: "/project",
    component: "ProjectPage",
    exact: true,
    protected: true,
    layout: "none",
  },
  {
    path: "/reset-password",
    component: "ResetPassword",
    exact: true,
    protected: false,
    layout: "auth",
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

export default routes;
