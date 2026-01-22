// src/presentation/redux/slices/projectSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Plan, Project, ProjectState } from "@/types";

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  search: "",
  members: [],
  membersLoading: false,
  membersError: null,

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
        data: Project[];
        page: number;
        totalPages: number;
      }>
    ) => {
      state.projects = action.payload.data;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.loading = false;
      // update currentProjects count in limits if exists
      if (state.limits) {
        state.limits.currentProjects = action.payload.data.length;
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
    // updateProject: (state, action: PayloadAction<Project>) => {
    //   const idx = state.projects.findIndex((p) => p.id === action.payload.id);
    //   if (idx !== -1) state.projects[idx] = action.payload;
    //   if (state.currentProject?.id === action.payload.id) {
    //     state.currentProject = action.payload;
    //   }
    // },
    updateProjectSuccess: (state, action: PayloadAction<Project>) => {
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

    setMembers(state, action) {
      state.members = action.payload;
      state.membersLoading = false;
    },
    setMembersLoading(state) {
      state.membersLoading = true;
    },
    setMembersError(state, action) {
      state.membersError = action.payload;
    },
    clearMembers(state) {
      state.members = [];
    },
    deleteMember: (state, action: PayloadAction<{ memberId: string }>) => {
      state.members = state.members.filter(
        (m) => m.id !== action.payload.memberId
      );
    },

    updateMemberRole: (
      state,
      action: PayloadAction<{
        memberId: string;
        role: "member" | "lead" | "manager";
      }>
    ) => {
      const member = state.members.find(
        (m) => m.id === action.payload.memberId
      );
      if (member) {
        member.role = action.payload.role;
      }
    },
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
  // updateProject,
  setProjectLoading,
  setProjectError,
  clearProjectError,
  setPlanLimits,
  clearMembers,
  setMembersError,
  setMembers,
  setMembersLoading,
  updateProjectSuccess,
  deleteMember,
  updateMemberRole,
} = projectSlice.actions;

export default projectSlice.reducer;
