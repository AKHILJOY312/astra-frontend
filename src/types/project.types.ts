//-----------------------------------------
//        Project
//-----------------------------------------

import type { Plan } from "./billing.types";

export type Project = {
  id: string;
  projectName: string;
  description: string;
  imageUrl: string | null;
  ownerId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

type Members = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  role: "manager" | "lead" | "member";
};

export type ProjectState = {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  search: string;
  members: Members[];
  membersLoading: boolean;
  membersError: string | null;

  limits: {
    maxProjects: number;
    maxMembersPerProject: number;
    currentProjects: number;
    planName: string;
  } | null;
  currentPlan: Plan | null;
};
