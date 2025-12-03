// src/data/api/planApi.ts
import apiCaller from "@/lib/apicaller";

export const getPlans = (page: number, limit: number) =>
  apiCaller.get("/admin/plans", { params: { page, limit } });

export const createPlan = (plan: any) => apiCaller.post("/admin/plans", plan);

export const updatePlan = (id: string, plan: any) =>
  apiCaller.put(`/admin/plans/${id}`, plan);

export const deletePlan = (id: string) =>
  apiCaller.delete(`/admin/plans/${id}`);

export const getCurrentPlan = () => apiCaller.get("/admin/plans/current");

export const getLimits = () => apiCaller.get("/admin/plans/limits");

export const getAvailablePlans = () => apiCaller.get("/subscription/plans");

export const upgradePlan = (planId: string) =>
  apiCaller.post("/subscription/razorpay/order", { planId });

export const getPlanLimits = () => apiCaller.get("/subscription/limits");
