// src/application/use-cases/plan/GetPlansUseCase.ts
import type { IPlanRepository } from "@/application/repo/IPlanRepository";
import { TYPES } from "@/di/types";
import type { Plan } from "@/domain/entities/plan/Plan";
import { inject, injectable } from "inversify";
@injectable()
export class GetPlansUseCase {
  constructor(
    @inject(TYPES.IPlanRepository)
    private repository: IPlanRepository
  ) {}

  async execute(
    page: number,
    limit: number
  ): Promise<{ data: Plan[]; total: number }> {
    return this.repository.getPlans(page, limit);
  }
}

// Similarly for others
