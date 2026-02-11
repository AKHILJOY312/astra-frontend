/**
 * Application Path Constants
 * Use these instead of hardcoded strings for navigation and links.
 */
export const PATHS = {
  // --- Public & Landing ---
  HOME: "/",

  // --- User Auth ---
  USER: {
    PROFILE: "/user/profile",
  },
  AUTH: {
    SIGN_UP: "/register",
    LOGIN: "/login",
    VERIFY_EMAIL: "/verify-email",
    FORGOT_PASSWORD: "/forget-password",
    RESET_PASSWORD: "/reset-password",
    AUTH_SUCCESS: "/success",
  },
  // --- Projects ---
  PROJECT: {
    DASHBOARD: "/projects",
    PROJECT_DETAILS: "/projects/:projectId",
    INVITE: "/invite",
  },
  // --- Billing & Account ---
  BILLING: {
    UPGRADE: "/upgrade",
    PAYMENT_SUCCESS: "/payment/success",
    PAYMENT_FAILED: "/payment/failed",
    BILLING_HISTORY: "/billing/history",
  },
  //Task
  TASK: {
    PAGE: "/tasks",
    LIST_TASK: "/projects/:projectId/task",
  },
  VIDEO: {
    PAGE: "/meetings",
    LOBBY: "/meeting/:code/lobby",
    MEETING: "/meeting/:code",
  },
  // --- Admin ---
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    PLANS: "/admin/plan",
    FORGOT_PASSWORD: "/admin/forgot-password",
    BILLING: "/admin/billing",
  },
} as const;

// Example Usage:
// <Link to={PATHS.DASHBOARD}>Dashboard</Link>
// navigate(PATHS.LOGIN);
