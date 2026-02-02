import { PATHS } from "./routeConstant";
import type { RouteItem } from "./routeTypes";

export const userRoutes: RouteItem[] = [
  {
    path: PATHS.HOME,
    component: "Home",
    exact: true,
    layout: "main",
    filePath: "user/cover/",
  },
  {
    path: PATHS.AUTH.SIGN_UP,
    component: "SignUp",
    exact: true,
    layout: "none",
    filePath: "user/auth/",
  },
  {
    path: PATHS.AUTH.VERIFY_EMAIL,
    component: "VerifyEmail",
    exact: true,
    layout: "auth", //auth,main,none,
    filePath: "user/auth/",
  },
  {
    path: PATHS.AUTH.LOGIN,
    component: "LoginPage",
    layout: "auth",
    filePath: "user/auth/",
  },
  {
    path: PATHS.AUTH.FORGOT_PASSWORD,
    component: "ForgetPassword",
    layout: "auth",
    filePath: "user/auth/",
  },
  {
    path: PATHS.AUTH.RESET_PASSWORD,
    component: "ResetPassword",
    exact: true,
    protected: false,
    layout: "auth",
    filePath: "user/auth/",
  },
  {
    path: PATHS.PROJECT.DASHBOARD,
    component: "Dashboard",
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

  {
    path: PATHS.PROJECT.PROJECT_DETAILS,
    component: "ProjectDetail",
    exact: true,
    protected: true,
    layout: "app",
    filePath: "user/project/",
  },
  {
    path: PATHS.BILLING.UPGRADE,
    component: "UpgradePlanPage",
    layout: "app",
    protected: true,
    filePath: "user/upgrade/",
  },

  {
    path: PATHS.USER.PROFILE,
    component: "UserProfile",
    layout: "app",
    protected: true,
    filePath: "user/profile/",
  },
  {
    path: PATHS.PROJECT.INVITE,
    component: "InvitePage",
    layout: "auth",
    protected: false,
    filePath: "user/project/",
  },
  {
    path: PATHS.BILLING.BILLING_HISTORY,
    component: "UserBillingHistory",
    layout: "app",
    protected: true,
    filePath: "user/upgrade/",
  },

  {
    path: PATHS.TASK.LIST_TASK,
    component: "ProjectBoardPage",
    layout: "app",
    protected: true,
    filePath: "user/task/",
  },
  {
    path: PATHS.TASK.TASKS,
    component: "TasksPage",
    layout: "app",
    protected: true,
    filePath: "user/task/",
  },

  {
    path: PATHS.VIDEO.PAGE,
    component: "VideoCallPage",
    layout: "app",
    protected: true,
    filePath: "user/video/",
  },
  {
    path: PATHS.VIDEO.LOBBY,
    component: "MeetingLobbyPage",
    layout: "app",
    protected: true,
    filePath: "user/video/",
  },
  {
    path: PATHS.VIDEO.MEETING,
    component: "MeetingRoomPage",
    layout: "app",
    protected: true,
    filePath: "user/video/",
  },
];

export const adminRoutes: RouteItem[] = [
  {
    path: PATHS.ADMIN.LOGIN,
    component: "SignIn",
    layout: "admin",
    filePath: "admin/AuthPages/",
  },
  {
    path: PATHS.ADMIN.DASHBOARD,
    component: "Home",
    layout: "admin",
    protected: true,
    filePath: "admin/Dashboard/",
  },
  {
    path: PATHS.ADMIN.USERS,
    component: "UsersManagementPage",
    layout: "admin",
    protected: true,
    filePath: "admin/Users/",
  },
  {
    path: PATHS.ADMIN.PLANS,
    component: "PlanManagementPage",
    layout: "admin",
    protected: true,
    filePath: "admin/Plan/",
  },
  {
    path: PATHS.ADMIN.FORGOT_PASSWORD,
    component: "Home",
    layout: "admin",
    protected: true,
    filePath: "admin/Dashboard/",
  },
];
