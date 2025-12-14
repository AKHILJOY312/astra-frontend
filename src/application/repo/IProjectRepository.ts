// src/application/repo/ProjectRepository.ts
import { Project } from "../../domain/entities/project/Project";
import type { CreateProjectDTO } from "../use-cases/index";

export interface IProjectRepository {
  create(dto: CreateProjectDTO): Promise<Project>;
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
}
