import type { Plan } from "@/domain/entities/plan/Plan";
import type { PlanLimits } from "../use-cases";

export interface IPlanRepository {
  getPlans(
    page: number,
    limit: number
  ): Promise<{ data: Plan[]; total: number }>;
  createPlan(plan: Partial<Plan>): Promise<Plan>;
  updatePlan(id: string, plan: Partial<Plan>): Promise<Plan>;
  deletePlan(id: string): Promise<void>;
  getCurrentPlan(): Promise<Plan | null>;
  getLimits(): Promise<PlanLimits>;
  getPlanById(planId: string): Promise<Plan | null>;
  getAllActivePlans(): Promise<Plan[]>;
  upgradeToPlan(planId: string): Promise<void>;
}
