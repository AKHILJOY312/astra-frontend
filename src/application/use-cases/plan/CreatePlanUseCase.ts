// src/application/use-cases/plan/CreatePlanUseCase.ts
import type { PlanRepository } from "@/application/repo/PlanRepository";
import { TYPES } from "@/di/types";
import type { Plan } from "@/domain/entities/plan/Plan";
import { inject, injectable } from "inversify";

export interface CreatePlanInput {
  name: string;
  description: string;
  price: number;
  finalAmount: number;
  currency: "INR" | "USD" | "EUR";
  billingCycle: "monthly" | "yearly";
  features: string[];
  maxProjects?: number;
  maxStorage?: number;
  isActive?: boolean;
}
@injectable()
export class CreatePlanUseCase {
  constructor(
    @inject(TYPES.PlanRepository)
    private repository: PlanRepository
  ) {}

  async execute(input: CreatePlanInput): Promise<Plan> {
    // You can add business rules here later (e.g. name uniqueness, pricing logic)
    return await this.repository.createPlan(input);
  }
}
