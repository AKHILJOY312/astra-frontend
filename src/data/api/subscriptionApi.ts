import type { VerifyPaymentDTO } from "@/application/repo/IUserSubscriptionRepository";
import apiCaller from "@/lib/apicaller";
import { API_ROUTES } from "./apiRoutes.constants";

export const createRazorpayOrder = (planId: string) =>
  apiCaller.post(API_ROUTES.SUBSCRIPTION.RAZORPAY_ORDER, { planId });

export const verifyPayment = (payload: VerifyPaymentDTO) =>
  apiCaller.post(API_ROUTES.SUBSCRIPTION.RAZORPAY_CAPTURE, payload);
