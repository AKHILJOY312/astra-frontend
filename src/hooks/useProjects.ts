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
} from "../redux/slice/projectSlice";
import type { RootState, AppDispatch } from "../redux/store/store";
import { openUpgradePlanModal } from "../redux/slice/uiSlice";
import {
  getUserProjects,
  userCreateProject,
  userUpdateProject,
} from "@/services/project.service";
import { getProjectMembers } from "@/services/membership.service";

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
        console.log("Memebers: ", members.data.data);
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
      dispatch(addProject(newProject.data));
      return newProject;
    } catch (err: unknown) {
      let message = "Failed to create project";

      if (err && typeof err === "object" && "response" in err && err.response) {
        const data = err.response as {
          error: string;
          upgradeRequired?: boolean;
        };
        message = data.error;

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
      dispatch(updateProjectSuccess(updated.data));
      return updated;
    } catch {
      dispatch(setProjectError("Failed to update project"));
      throw error;
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
    clearError: () => dispatch(clearProjectError()),
  };
};
