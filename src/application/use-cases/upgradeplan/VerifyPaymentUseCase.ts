import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IUserSubscriptionRepository } from "@/application/repo/IUserSubscriptionRepository";

interface Input {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

interface Output {
  success: boolean;
}

@injectable()
export class VerifyPaymentUseCase {
  constructor(
    @inject(TYPES.IUserSubscriptionRepository)
    private subscriptionRepo: IUserSubscriptionRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    await this.subscriptionRepo.activateSubscriptionFromOrder(
      input.razorpayOrderId,
      input.razorpayPaymentId,
      input.razorpaySignature
    );

    return { success: true };
  }
}
