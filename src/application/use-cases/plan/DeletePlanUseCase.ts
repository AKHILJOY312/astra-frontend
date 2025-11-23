import type { PlanRepository } from "@/application/repo/PlanRepository";
import { TYPES } from "@/di/types";
import { inject, injectable } from "inversify";
@injectable()
export class DeletePlanUseCase {
  constructor(
    @inject(TYPES.PlanRepository)
    private repository: PlanRepository
  ) {}

  async execute(id: string): Promise<void> {
    // Optional: Soft-delete instead of hard-delete
    await this.repository.updatePlan(id, { isDeleted: true });

    // Hard delete (your current backend likely does this)
    // await this.repository.deletePlan(id);
  }
}
