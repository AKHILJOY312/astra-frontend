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
} from "../redux/slice/projectSlice";
import type { RootState, AppDispatch } from "../redux/store/store";
import { openUpgradePlanModal } from "../redux/slice/uiSlice";

const listProjectsUC = container.get<ListUserProjectsUseCase>(
  TYPES.ListUserProjectsUseCase
);
const createProjectUC = container.get<CreateProjectUseCase>(
  TYPES.CreateProjectUseCase
);

export const useProjects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error, currentProject, page, search, totalPages } =
    useSelector((state: RootState) => state.project);

  const loadProjects = useCallback(
    async (params?: Partial<{ page: number; search: string }>) => {
      dispatch(setProjectLoading());

      try {
        const response = await listProjectsUC.execute({
          page: params?.page ?? page,
          limit: 8,
          search: params?.search ?? search,
        });
        console.log("checking the datat:", response);
        dispatch(setProjects(response));
      } catch (err: any) {
        dispatch(setProjectError("Failed to load projects"));
      }
    },
    [dispatch, page, search]
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

      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response?.data
      ) {
        const data = err.response.data as {
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

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    page,
    totalPages,
    loadProjects,
    currentProject,
    refreshProjects: loadProjects,
    createProject,
    clearError: () => dispatch(clearProjectError()),
  };
};
