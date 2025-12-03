import type { IPlanRepository } from "@/application/repo/IPlanRepository";
import { TYPES } from "@/di/types";
import type { Plan } from "@/domain/entities/plan/Plan";
import { inject, injectable } from "inversify";

@injectable()
export class GetAvailablePlansUseCase {
  constructor(
    @inject(TYPES.IPlanRepository) private planRepo: IPlanRepository
  ) {}

  /**
   * Returns all active plans the user can purchase or upgrade to
   */
  async execute(): Promise<Plan[]> {
    const result = await this.planRepo.getAllActivePlans();
    // console.log(result);
    return result;
  }
}
