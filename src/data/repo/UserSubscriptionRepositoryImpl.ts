import type { IUserSubscriptionRepository } from "@/application/repo/IUserSubscriptionRepository";
import * as subscriptionApi from "../api/subscriptionApi";

export class UserSubscriptionRepositoryImpl
  implements IUserSubscriptionRepository
{
  async createPendingSubscription() {
    // Backend already stores pending subscription.
    return;
  }

  async activateSubscriptionFromOrder(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    await subscriptionApi.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
  }
}
