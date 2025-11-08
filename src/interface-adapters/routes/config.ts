import type { RouteItem } from "./routeTypes";

const routes: RouteItem[] = [
  // {
  //   path: ["/", "/home"],
  //   component: "Home",
  //   exact: true,
  // },

  {
    path: "/",
    component: "Home.tsx",
    exact: true,
    layout: "main",
  },
  {
    path: "/register",
    component: "SignUp.tsx",
    exact: true,
    layout: "auth",
  },
  {
    path: "/verify-email",
    component: "VerifyEmail.tsx",
    exact: true,
    layout: "auth", //auth,main,none
  },
  {
    path: "/login",
    component: "LoginPage.tsx",
    exact: true,
    layout: "auth",
  },
  {
    path: "/project",
    component: "ProjectPage",
    exact: true,
    protected: true,
    layout: "main",
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
