import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProjects,
  addProject,
  setProjectLoading,
  setProjectError,
  clearProjectError,
  setMembersLoading,
  setMembers,
  setMembersError,
  updateProjectSuccess,
  deleteMember,
  updateMemberRole,
} from "../redux/slice/projectSlice";
import type { RootState, AppDispatch } from "../redux/store/store";
import { openUpgradePlanModal } from "../redux/slice/uiSlice";
import {
  getUserProjects,
  userCreateProject,
  userUpdateProject,
} from "@/services/project.service";
import {
  changeMemberRole,
  getProjectMembers,
  removeMember,
} from "@/services/membership.service";
import axios from "axios";

export const useProjects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    projects,
    loading,
    error,
    currentProject,
    page,
    search,
    totalPages,
    members,
    membersLoading,
  } = useSelector((state: RootState) => state.project);

  const loadProjects = useCallback(
    async (params?: Partial<{ page: number; search: string }>) => {
      dispatch(setProjectLoading());

      try {
        const response = await getUserProjects({
          page: params?.page ?? page,
          limit: 8,
          search: params?.search ?? search,
        });
        dispatch(setProjects(response.data));
      } catch (err) {
        console.error(err);
        dispatch(setProjectError("Failed to load projects"));
      }
    },
    [dispatch, page, search]
  );

  const loadProjectMembers = useCallback(
    async (projectId: string) => {
      dispatch(setMembersLoading());

      try {
        const members = await getProjectMembers(projectId);

        dispatch(setMembers(members.data.data));
      } catch {
        dispatch(setMembersError("Failed to load members"));
      }
    },
    [dispatch]
  );

  const createProject = async (
    name: string,
    description?: string,
    imageUrl?: string | null
  ) => {
    dispatch(clearProjectError());

    try {
      const newProject = await userCreateProject({
        projectName: name,
        description,
        imageUrl,
      });
      dispatch(addProject(newProject.data.project));
      return newProject;
    } catch (err: unknown) {
      let message = "Failed to create project";
      if (err && typeof err === "object" && "response" in err && err.response) {
        const data = err.response as {
          message: string;
          upgradeRequired?: boolean;
        };
        message = data.message;

        if (data.upgradeRequired) {
          dispatch(openUpgradePlanModal());
        }
      }

      dispatch(setProjectError(message));
      throw err;
    }
  };

  const updateProject = async (
    projectId: string,
    payload: { projectName: string; description?: string }
  ) => {
    dispatch(clearProjectError());

    try {
      const updated = await userUpdateProject(projectId, payload);
      console.log(updated);
      dispatch(updateProjectSuccess(updated.data.data));
      return updated;
    } catch (err: unknown) {
      let message = "Failed to update project";

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.message || err.response?.data?.error || message;
      }

      dispatch(setProjectError(message));
      throw err;
    }
  };

  const changeMemberRoleAsync = async (
    projectId: string,
    memberId: string,
    role: "member" | "lead" | "manager"
  ) => {
    try {
      await changeMemberRole(projectId, memberId, role);

      // Optimistically update Redux store
      dispatch(updateMemberRole({ memberId, role }));

      // Optional: refetch to ensure sync (in case of race conditions)
      // await loadProjectMembers(projectId);
    } catch (err) {
      console.error("Failed to change member role:", err);
      dispatch(setMembersError("Failed to update role"));
      throw err;
    }
  };

  const removeMemberAsync = async (projectId: string, memberId: string) => {
    try {
      await removeMember(projectId, memberId);

      // Optimistically remove from store
      dispatch(deleteMember({ memberId }));

      // Optional: refetch members
      // await loadProjectMembers(projectId);
    } catch (err) {
      console.error("Failed to remove member:", err);
      dispatch(setMembersError("Failed to remove member"));
      throw err;
    }
  };

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    page,
    totalPages,
    members,
    membersLoading,
    updateProject,
    loadProjects,
    currentProject,
    refreshProjects: loadProjects,
    createProject,
    loadProjectMembers,
    changeMemberRole: changeMemberRoleAsync,
    removeMember: removeMemberAsync,
    clearError: () => dispatch(clearProjectError()),
  };
};
