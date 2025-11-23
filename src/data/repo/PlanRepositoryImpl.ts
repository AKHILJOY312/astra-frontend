// src/data/repo/PlanRepositoryImpl.ts
import apiCaller from "@/lib/apicaller";
import type { Plan } from "@/domain/entities/plan/Plan";
import type { PlanRepository } from "@/application/repo/PlanRepository";

export class PlanRepositoryImpl implements PlanRepository {
  async getPlans(page: number, limit: number) {
    console.log("PLANLIST → FETCHING PAGE:", page);

    const res = await apiCaller.get("/admin/plans", {
      params: { page, limit },
    });

    console.log("PLANLIST → RECEIVED DATA:", res.data);

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
    await apiCaller.delete(`/admin/plans/${id}`);
  }
}
