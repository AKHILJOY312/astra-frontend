// types/adminBilling.types.ts

export type BillingQueryParams = {
  page: number;
  limit: number;
  search?: string;
};

export type BillingUserOverview = {
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  subscriptionStatus: string;
  totalSpent: number;
  lastPaymentDate?: Date;
  failedAttemptCount: number;
};

export type BillingListResponse = {
  users: BillingUserOverview[];
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
};

export type AdminDashboardResponse = {
  revenue: {
    mrr: number;
    today: number;
    thisMonth: number;
    monthOverMonthChange: number;
    byPlan: {
      planName: string;
      userCount: number;
      revenue: number;
    }[];
  };

  subscriptions: {
    active: number;
    pending: number;
    canceled: number;
    expired: number;
    newThisMonth: number;
    canceledThisMonth: number;
    expiringSoon: number;
    churnRate: number;
  };
  payments: {
    today: {
      success: number;
      failed: number;
      pending: number;
    };
    thisMonth: {
      refunds: number;
    };
  };
  users: {
    total: number;
    active: number;
    inactive: number;
    new: {
      today: number;
      thisWeek: number;
    };
  };

  lastUpdated: Date;
};
