// src/data/api/membershipApi.ts
import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export const addMember = (
  projectId: string,
  payload: { newMemberEmail: string; role?: "member" | "lead" | "manager" }
) => api.post(API_ROUTES.PROJECTS.MEMBERS(projectId), payload);

export const getProjectMembers = (projectId: string) =>
  api.get(API_ROUTES.PROJECTS.MEMBERS(projectId));

export const removeMember = (projectId: string, memberId: string) =>
  api.delete(API_ROUTES.PROJECTS.MEMBER_BY_ID(projectId, memberId));

export const changeMemberRole = (
  projectId: string,
  memberId: string,
  role: "member" | "lead" | "manager"
) => api.patch(API_ROUTES.PROJECTS.MEMBER_ROLE(projectId, memberId), { role });
