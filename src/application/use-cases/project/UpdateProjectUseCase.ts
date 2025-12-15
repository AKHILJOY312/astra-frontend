import type { IProjectRepository } from "@/application/repo/IProjectRepository";
import { TYPES } from "@/di/types";
import type { Project } from "@/domain/types/index.";
import { inject, injectable } from "inversify";

export interface UpdateProjectDTO {
  projectName: string;
  description?: string;
  imageUrl?: string | null;
}

@injectable()
export class UpdateProjectUseCase {
  constructor(
    @inject(TYPES.IProjectRepository)
    private projectRepo: IProjectRepository
  ) {}

  async execute(projectId: string, dto: UpdateProjectDTO): Promise<Project> {
    const project = await this.projectRepo.update(projectId, dto);
    return project;
  }
}
