// src/application/use-cases/plan/CreatePlanUseCase.ts
import type { IPlanRepository } from "@/application/repo/IPlanRepository";
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
  maxMembersPerProject?: number;
  isActive?: boolean;
}
@injectable()
export class CreatePlanUseCase {
  constructor(
    @inject(TYPES.IPlanRepository)
    private repository: IPlanRepository
  ) {}

  async execute(input: CreatePlanInput): Promise<Plan> {
    // You can add business rules here later (e.g. name uniqueness, pricing logic)
    return await this.repository.createPlan(input);
  }
}
