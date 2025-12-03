// src/application/use-cases/project/ListUserProjectsUseCase.ts
import type { IProjectRepository } from "@/application/repo/IProjectRepository";
import { TYPES } from "@/di/types";
import type { Project } from "@/domain/types/index.";
import { inject, injectable } from "inversify";
@injectable()
export class ListUserProjectsUseCase {
  constructor(
    @inject(TYPES.IProjectRepository) private projectRepo: IProjectRepository
  ) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepo.getUserProjects();
  }
}
