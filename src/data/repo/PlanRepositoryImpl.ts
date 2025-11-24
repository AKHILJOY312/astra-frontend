// src/data/repo/PlanRepositoryImpl.ts
import apiCaller from "@/lib/apicaller";
import type { Plan } from "@/domain/entities/plan/Plan";
import type { PlanRepository } from "@/application/repo/PlanRepository";

export class PlanRepositoryImpl implements PlanRepository {
  async getPlans(page: number, limit: number) {
    const res = await apiCaller.get("/admin/plans", {
      params: { page, limit },
    });

    // ADD THIS LINE — fixes everything
    return { data: res.data.plans as Plan[], total: res.data.total };
  }

  async createPlan(plan: Partial<Plan>) {
    const res = await apiCaller.post("/admin/plans", plan);
    return res.data;
  }

  async updatePlan(id: string, plan: Partial<Plan>) {
    const res = await apiCaller.put(`/admin/plans/${id}`, plan);
    return res.data;
  }

  async deletePlan(id: string) {
    console.log("*id:" + id);
    await apiCaller.delete(`/admin/plans/${id}`);
  }
}
