import type { Plan } from "@/domain/entities/plan/Plan";
import type { IPlanRepository } from "@/application/repo/IPlanRepository";
import * as planApi from "../api/planApi";
import { planResponseToEntity } from "../mappers/planMapper";

export class PlanRepositoryImpl implements IPlanRepository {
  async getPlans(page: number, limit: number) {
    const { data } = await planApi.getPlans(page, limit);

    return {
      data: data.plans.map(planResponseToEntity),
      total: data.total,
    };
  }

  async createPlan(plan: Partial<Plan>): Promise<Plan> {
    const { data } = await planApi.createPlan(plan);
    return planResponseToEntity(data);
  }

  async updatePlan(id: string, plan: Partial<Plan>): Promise<Plan> {
    const { data } = await planApi.updatePlan(id, plan);
    return planResponseToEntity(data);
  }

  async deletePlan(id: string): Promise<void> {
    await planApi.deletePlan(id);
  }

  // ========== USER SIDE ==========

  async getAllActivePlans(): Promise<Plan[]> {
    const { data } = await planApi.getAvailablePlans();
    return data.plans.map(planResponseToEntity);
  }

  async getPlanById(planId: string): Promise<Plan | null> {
    const plans = await this.getAllActivePlans();
    return plans.find((p) => p.id === planId) || null;
  }

  async getCurrentPlan(): Promise<Plan | null> {
    const { data } = await planApi.getCurrentPlan();
    return data.currentPlan ? planResponseToEntity(data.currentPlan) : null;
  }

  async upgradeToPlan(planId: string): Promise<void> {
    await planApi.upgradePlan(planId);
  }

  async getLimits() {
    const { data } = await planApi.getLimits();
    return data.limits;
  }
}
