// import { inject, injectable } from "inversify";
// import { TYPES } from "@/di/types";
// import type { PlanRepository } from "@/application/repo/IPlanRepository";
// import { RazorpayService } from "./IRazorpayService";

// @injectable()
// export class PlanService {
//   constructor(
//     @inject(TYPES.PlanRepository) private repo: PlanRepository,
//     private razorpay = new RazorpayService()
//   ) {}

//   async upgrade(planId: string) {
//     const orderData = await this.repo.upgradeToPlan(planId);
//     return orderData;
//   }

//   openPaymentGateway(orderData: any, onSuccess: Function, onCancel: Function) {
//     this.razorpay.openCheckout(orderData, onSuccess, onCancel);
//   }
// }
