// types/adminBilling.types.ts

import type { PaymentStatus } from "./billing.types";

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
///--------------------------------
export type UserBillingDetails = {
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
    signupDate: Date;
  };
  subscription: {
    planName: string;

    status: string;
    startDate?: Date;
    endDate?: Date | null;
  };
  stats: {
    ltv: number;
    failedCount: number;
    totalTransactions: number;
  };
  paymentHistory: AdminPaymentHistoryRow[];
};

interface AdminPaymentHistoryRow {
  _id: string;
  userId: string;
  planId?: string;
  planName?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  invoiceNumber?: string;
  billingSnapshot?: unknown;
  createdAt: Date;
}

//-----------------------------------------
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
