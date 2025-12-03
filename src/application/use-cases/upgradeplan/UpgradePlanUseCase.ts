// src/application/use-cases/plan/UpgradePlanUseCase.ts
import { inject, injectable } from "inversify";
import type { IPlanRepository } from "../../repo/IPlanRepository";
import { TYPES } from "@/di/types";

export interface UpgradePlanDTO {
  planId: string;
}
@injectable()
export class UpgradePlanUseCase {
  constructor(
    @inject(TYPES.IPlanRepository) private planRepo: IPlanRepository
  ) {}

  async execute(dto: UpgradePlanDTO): Promise<void> {
    const { planId } = dto;

    // Optional: validate plan exists
    const plan = await this.planRepo.getPlanById(planId);
    if (!plan) {
      throw new Error("Invalid plan selected");
    }

    // This calls your backend /subscription/upgrade
    await this.planRepo.upgradeToPlan(planId);
  }
}
