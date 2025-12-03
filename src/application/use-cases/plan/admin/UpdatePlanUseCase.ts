// src/application/use-cases/plan/UpdatePlanUseCase.ts
import type { IPlanRepository } from "@/application/repo/IPlanRepository";
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
  maxMembersPerProject?: number;
  isActive?: boolean;
}
@injectable()
export class UpdatePlanUseCase {
  constructor(
    @inject(TYPES.IPlanRepository)
    private repository: IPlanRepository
  ) {}

  async execute(id: string, input: UpdatePlanInput): Promise<Plan> {
    // Business rule: cannot deactivate if it's the only active plan (example)
    // Add more rules as needed

    return await this.repository.updatePlan(id, input);
  }
}
