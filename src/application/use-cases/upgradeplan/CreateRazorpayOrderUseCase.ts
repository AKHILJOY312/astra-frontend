import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IRazorpayService } from "@/application/services/IRazorpayService";
import type { IPlanRepository } from "@/application/repo/IPlanRepository";

interface Output {
  orderId: string;
  amount: number;
  currency: string;
  planName: string;
  keyId: string;
}

@injectable()
export class CreateRazorpayOrderUseCase {
  constructor(
    @inject(TYPES.IRazorpayService) private razorpayService: IRazorpayService,
    @inject(TYPES.IPlanRepository) private planRepo: IPlanRepository
  ) {}

  async execute(planId: string): Promise<Output> {
    const plan = await this.planRepo.getPlanById(planId);
    if (!plan) throw new Error("Plan not found");
    console.log("planId: ", planId);
    const data = await this.razorpayService.createOrder({ planId });
    console.log("createOrder from the us e Case: ", data);
    return {
      orderId: data.razorpayOrderId,
      amount: data.amount,
      currency: data.currency,
      planName: plan.name,
      keyId: data.keyId,
    };
  }
}
