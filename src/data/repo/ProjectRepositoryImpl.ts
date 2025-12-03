// src/data/repo/ProjectRepositoryImpl.ts
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

    // Handle limit / error response
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create project");
    }

    return projectResponseToEntity(response.data.data);
  }

  async getUserProjects() {
    const response = await projectApi.getUserProjects();

    // If backend sent error format
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to load projects");
    }

    const projectsArray = response.data.data;
    return projectsArray.map(projectResponseToEntity);
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
  // src/data/repo/PlanRepositoryImpl.ts
  async upgradeToPlan(planId: string): Promise<void> {
    await projectApi.upgradePlan(planId);
  }
}
