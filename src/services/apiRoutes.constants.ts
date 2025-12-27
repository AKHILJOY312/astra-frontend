export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    VERIFY_RESET_TOKEN: "/auth/verify-reset-token",
  },

  ADMIN: {
    LOGIN: "/admin/auth/login",
    USERS: "/admin/users",
    USER_STATUS: (id: string) => `/admin/users/${id}/status`,
    USER_ROLE: (id: string) => `/admin/users/${id}/role`,
    PLANS: "/admin/plans",
    PLAN_BY_ID: (id: string) => `/admin/plans/${id}`,
    CURRENT_PLAN: "/admin/plans/current",
    PLAN_LIMITS: "/admin/plans/limits",
  },

  PROJECTS: {
    ROOT: "/projects",
    BY_ID: (projectId: string) => `/projects/${projectId}`,
    MEMBERS: (projectId: string) => `/projects/${projectId}/members`,
    MEMBER_BY_ID: (projectId: string, memberId: string) =>
      `/projects/${projectId}/members/${memberId}`,
    MEMBER_ROLE: (projectId: string, memberId: string) =>
      `/projects/${projectId}/members/${memberId}/role`,
    CHANNELS: (projectId: string) => `/projects/${projectId}/channels`,
    CHANNEL_BY_ID: (projectId: string, channelId: string) =>
      `/projects/${projectId}/channels/${channelId}`,
  },

  SUBSCRIPTION: {
    PLANS: "/subscription/plans",
    LIMITS: "/subscription/limits",
    UPGRADE: "/subscription/upgrade",
    RAZORPAY_ORDER: "/subscription/razorpay/order",
    RAZORPAY_CAPTURE: "/subscription/razorpay/capture",
  },

  USERS: {
    ME: "/users/me",
    PROFILE_IMAGE_UPLOAD: "/users/me/profile-image/upload-url",
    PROFILE_IMAGE_SAVE: "/users/me/profile-image",
  },
} as const;
