import { Project } from "../../domain/entities/project/Project";
import type { CreateProjectDTO } from "../use-cases/index";
import type { UpdateProjectDTO } from "../use-cases/project/UpdateProjectUseCase";

export interface IProjectRepository {
  create(dto: CreateProjectDTO): Promise<Project>;

  update(projectId: string, dto: UpdateProjectDTO): Promise<Project>;

  getUserProjects(input: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{
    projects: Project[];
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  }>;

  getById(id: string): Promise<Project | null>;

  delete(projectId: string): Promise<void>;
}
