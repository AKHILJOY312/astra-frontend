// src/data/api/projectApi.ts
import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export const userCreateProject = (payload: {
  projectName: string;
  description?: string;
  imageUrl?: string | null;
}) => api.post(API_ROUTES.PROJECTS.ROOT, payload);

export const getUserProjects = (params: {
  page: number;
  limit: number;
  search?: string;
}) =>
  api.get(API_ROUTES.PROJECTS.ROOT, {
    params,
  });

export const userUpdateProject = (
  projectId: string,
  payload: {
    projectName: string;
    description?: string;
    imageUrl?: string | null;
  }
) => api.patch(API_ROUTES.PROJECTS.BY_ID(projectId), payload);

export const getProjectById = (projectId: string) =>
  api.get(API_ROUTES.PROJECTS.BY_ID(projectId));

export const deleteProject = (projectId: string) =>
  api.delete(API_ROUTES.PROJECTS.BY_ID(projectId));

export const upgradePlan = (planId: string) =>
  api.post(API_ROUTES.SUBSCRIPTION.UPGRADE, { planId });
