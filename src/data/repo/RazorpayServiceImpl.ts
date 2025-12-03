import { injectable } from "inversify";
import type {
  IRazorpayService,
  CreateOrderInput,
  CreateOrderOutput,
  VerifyPaymentInput,
} from "@/application/services/IRazorpayService";

import * as razorpayApi from "../api/subscriptionApi";

@injectable()
export class RazorpayServiceImpl implements IRazorpayService {
  async createOrder({ planId }: CreateOrderInput): Promise<CreateOrderOutput> {
    const { data } = await razorpayApi.createRazorpayOrder(planId);
    console.log("data: ", data.data);
    return {
      razorpayOrderId: data.data.razorpayOrderId,
      amount: data.data.amount,
      currency: data.data.currency,
      keyId: data.data.keyId,
    };
  }

  verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }: VerifyPaymentInput): boolean {
    // Frontend cannot verify – only check they exist
    return Boolean(razorpayOrderId && razorpayPaymentId && razorpaySignature);
  }
}
