import apiCaller from "@/lib/apicaller";

export const createRazorpayOrder = (planId: string) =>
  apiCaller.post("/subscription/razorpay/order", { planId });

export const verifyPayment = (payload: any) =>
  apiCaller.post("/subscription/razorpay/capture", payload);
