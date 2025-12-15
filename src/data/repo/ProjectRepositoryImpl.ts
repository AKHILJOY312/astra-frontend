import type { UpdateProjectDTO } from "@/application/use-cases/project/UpdateProjectUseCase";
import type { IProjectRepository } from "../../application/repo/IProjectRepository";
import * as projectApi from "../api/projectApi";
import { projectResponseToEntity } from "../mappers/projectMapper";

export class ProjectRepositoryImpl implements IProjectRepository {
  async create(dto: {
    projectName: string;
    description?: string;
    imageUrl?: string | null;
  }) {
    const response = await projectApi.createProject(dto);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create project");
    }

    return projectResponseToEntity(response.data.data);
  }

  async update(projectId: string, dto: UpdateProjectDTO) {
    const response = await projectApi.updateProject(projectId, dto);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update project");
    }

    return projectResponseToEntity(response.data.data);
  }
  async getUserProjects(params: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const response = await projectApi.getUserProjects(params);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to load projects");
    }

    const { data, page, limit, totalPages, totalCount } = response.data;

    return {
      projects: data.map(projectResponseToEntity),
      page,
      limit,
      totalPages,
      totalCount,
    };
  }

  async getById(projectId: string) {
    try {
      const response = await projectApi.getProjectById(projectId);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to load project");
      }

      return projectResponseToEntity(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  }

  async delete(projectId: string) {
    await projectApi.deleteProject(projectId);
  }

  async upgradeToPlan(planId: string): Promise<void> {
    await projectApi.upgradePlan(planId);
  }
}
