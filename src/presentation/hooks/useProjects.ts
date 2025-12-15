import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { ListUserProjectsUseCase } from "../../application/use-cases/project/ListUserProjectsUseCase";
import { CreateProjectUseCase } from "../../application/use-cases/project/CreateProjectUseCase";
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
import { GetProjectMembersUseCase } from "@/application/use-cases";
import type { UpdateProjectUseCase } from "@/application/use-cases/project/UpdateProjectUseCase";

const listProjectsUC = container.get<ListUserProjectsUseCase>(
  TYPES.ListUserProjectsUseCase
);
const createProjectUC = container.get<CreateProjectUseCase>(
  TYPES.CreateProjectUseCase
);

const listUserInProject = container.get<GetProjectMembersUseCase>(
  TYPES.GetProjectMembersUseCase
);
const updateProjectUC = container.get<UpdateProjectUseCase>(
  TYPES.UpdateProjectUseCase
);
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
        const response = await listProjectsUC.execute({
          page: params?.page ?? page,
          limit: 8,
          search: params?.search ?? search,
        });
        dispatch(setProjects(response));
      } catch (err: any) {
        dispatch(setProjectError("Failed to load projects"));
      }
    },
    [dispatch, page, search]
  );

  const loadProjectMembers = useCallback(
    async (projectId: string) => {
      dispatch(setMembersLoading());

      try {
        const members = await listUserInProject.execute(projectId);
        console.log("listUserInProject.execute(projectId); ", members);
        dispatch(setMembers(members));
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
      const newProject = await createProjectUC.execute({
        projectName: name,
        description,
        imageUrl,
      });
      dispatch(addProject(newProject));
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
      const updated = await updateProjectUC.execute(projectId, payload);
      dispatch(updateProjectSuccess(updated));
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
