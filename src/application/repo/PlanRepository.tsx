import type { Plan } from "@/domain/entities/plan/Plan";

export interface PlanRepository {
  getPlans(
    page: number,
    limit: number
  ): Promise<{ data: Plan[]; total: number }>;
  createPlan(plan: Partial<Plan>): Promise<Plan>;
  updatePlan(id: string, plan: Partial<Plan>): Promise<Plan>;
  deletePlan(id: string): Promise<void>;
}
