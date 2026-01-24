//-----------------------------------------
//        Plan
//-----------------------------------------

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  finalAmount: number;
  currency: "INR" | "USD" | "EUR";
  billingCycle: "monthly" | "yearly";
  features: string[];
  maxProjects: number;
  maxMembersPerProject: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserPlanList = {
  id: string;
  name: string;
  description?: string;
  price: number;
  finalAmount: number;
  features: string[];
  maxProjects: number;
  maxMembersPerProject: number;
  isCurrent: boolean;
};

//-----------------------------------------
//        UserSubscription
//-----------------------------------------
export type VerifyPayment = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

//payment hisotry billing hisotry

export type Subscription = {
  planName: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
  amount: number;
};
export type Payment = {
  paymentId: string;
  invoiceNumber?: string;
  planName: string;
  amount: number;
  currency: string;
  status: "pending" | "captured" | "failed";
  method: string;
  paidAt: string;
  canDownloadInvoice: boolean;
};
export type Pagination = {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
};
export type BillingResponse = {
  subscription: Subscription | null;
  payments: Payment[];
  pagination: Pagination;
};
