// src/application/use-cases/project/GetProjectByIdUseCase.ts
import type { IProjectRepository } from "../../repo/IProjectRepository";
import { Project } from "../../../domain/entities/project/Project";
import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
@injectable()
export class GetProjectByIdUseCase {
  constructor(
    @inject(TYPES.IProjectRepository) private projectRepo: IProjectRepository
  ) {}

  async execute(projectId: string): Promise<Project> {
    const project = await this.projectRepo.getById(projectId);
    if (!project) throw new Error("Project not found");
    return project;
  }
}
