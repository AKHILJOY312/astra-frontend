// src/application/use-cases/plan/UpdatePlanUseCase.ts
import type { PlanRepository } from "@/application/repo/PlanRepository";
import { TYPES } from "@/di/types";
import type { Plan } from "@/domain/entities/plan/Plan";
import { inject, injectable } from "inversify";

export interface UpdatePlanInput {
  name?: string;
  description?: string;
  price?: number;
  finalAmount?: number;
  currency?: "INR" | "USD" | "EUR";
  billingCycle?: "monthly" | "yearly";
  features?: string[];
  maxProjects?: number;
  maxStorage?: number;
  isActive?: boolean;
}
@injectable()
export class UpdatePlanUseCase {
  constructor(
    @inject(TYPES.PlanRepository)
    private repository: PlanRepository
  ) {}

  async execute(id: string, input: UpdatePlanInput): Promise<Plan> {
    // Business rule: cannot deactivate if it's the only active plan (example)
    // Add more rules as needed

    return await this.repository.updatePlan(id, input);
  }
}
