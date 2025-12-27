// src/data/api/planApi.ts
import type { Plan } from "@/types";
import apiCaller from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

//admin
export const getPlans = (page: number, limit: number) =>
  apiCaller.get(API_ROUTES.ADMIN.PLANS, { params: { page, limit } });

export const createPlan = (plan: Partial<Plan>) =>
  apiCaller.post(API_ROUTES.ADMIN.PLANS, plan);

export const updatePlan = (id: string, plan: Partial<Plan>) =>
  apiCaller.put(API_ROUTES.ADMIN.PLAN_BY_ID(id), plan);

export const deletePlan = (id: string) =>
  apiCaller.delete(API_ROUTES.ADMIN.PLAN_BY_ID(id));

//user
export const getCurrentPlan = () =>
  apiCaller.get(API_ROUTES.ADMIN.CURRENT_PLAN);

export const getLimits = () => apiCaller.get(API_ROUTES.ADMIN.PLAN_LIMITS);

export const getAvailablePlans = () =>
  apiCaller.get(API_ROUTES.SUBSCRIPTION.PLANS);

export const upgradePlan = (planId: string) =>
  apiCaller.post(API_ROUTES.SUBSCRIPTION.RAZORPAY_ORDER, { planId });

export const getPlanLimits = () =>
  apiCaller.get(API_ROUTES.SUBSCRIPTION.LIMITS);
