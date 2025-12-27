import type { VerifyPayment } from "@/types";
import apiCaller from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export const createRazorpayOrder = (planId: string) =>
  apiCaller.post(API_ROUTES.SUBSCRIPTION.RAZORPAY_ORDER, { planId });

export const verifyPayment = (payload: VerifyPayment) =>
  apiCaller.post(API_ROUTES.SUBSCRIPTION.RAZORPAY_CAPTURE, payload);
