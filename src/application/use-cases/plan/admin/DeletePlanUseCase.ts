import type { IPlanRepository } from "@/application/repo/IPlanRepository";
import { TYPES } from "@/di/types";
import { inject, injectable } from "inversify";
@injectable()
export class DeletePlanUseCase {
  constructor(
    @inject(TYPES.IPlanRepository)
    private repository: IPlanRepository
  ) {}

  async execute(id: string): Promise<void> {
    // Optional: Soft-delete instead of hard-delete
    await this.repository.deletePlan(id);

    // Hard delete (your current backend likely does this)
    // await this.repository.deletePlan(id);
  }
}
