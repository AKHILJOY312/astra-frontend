import type { IPlanRepository } from "@/application/repo/IPlanRepository";
import { TYPES } from "@/di/types";
import { inject, injectable } from "inversify";

export interface PlanLimits {
  maxProjects: number;
  maxMembersPerProject: number;
  currentProjects: number;
  planName: string;
}
@injectable()
export class GetPlanLimitsUseCase {
  constructor(
    @inject(TYPES.IPlanRepository) private planRepo: IPlanRepository
  ) {}

  async execute(): Promise<PlanLimits> {
    return await this.planRepo.getLimits();
  }
}
