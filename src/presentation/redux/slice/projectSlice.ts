// src/presentation/redux/slices/projectSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../../domain/entities/project/Project";
import type { Plan } from "../../../domain/entities/plan/Plan";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  search: string;

  limits: {
    maxProjects: number;
    maxMembersPerProject: number;
    currentProjects: number;
    planName: string;
  } | null;
  currentPlan: Plan | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  search: "",

  limits: null,
  currentPlan: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects: (
      state,
      action: PayloadAction<{
        projects: Project[];
        page: number;
        totalPages: number;
      }>
    ) => {
      state.projects = action.payload.projects;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.loading = false;

      // update currentProjects count in limits if exists
      if (state.limits) {
        state.limits.currentProjects = action.payload.projects.length;
      }
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload);
      if (state.limits) state.limits.currentProjects = state.projects.length;
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
      if (state.limits) state.limits.currentProjects = state.projects.length;
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const idx = state.projects.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = action.payload;
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = action.payload;
      }
    },
    setProjectLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProjectError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProjectError: (state) => {
      state.error = null;
    },

    // new: set plan limits
    setPlanLimits: (
      state,
      action: PayloadAction<{
        limits: ProjectState["limits"];
        currentPlan: Plan;
      }>
    ) => {
      state.limits = action.payload.limits;
      state.currentPlan = action.payload.currentPlan;
    },
  },
});

export const {
  setProjects,
  setCurrentProject,
  addProject,
  removeProject,
  updateProject,
  setProjectLoading,
  setProjectError,
  clearProjectError,
  setPlanLimits, // new
} = projectSlice.actions;

export default projectSlice.reducer;
