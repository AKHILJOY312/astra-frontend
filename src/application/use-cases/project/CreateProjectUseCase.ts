import type { IProjectRepository } from "@/application/repo/IProjectRepository";
import { TYPES } from "@/di/types";
import type { Project } from "@/domain/types/index.";
import { inject, injectable } from "inversify";

export interface CreateProjectDTO {
  projectName: string;
  description?: string;
  imageUrl?: string | null;
}
@injectable()
export class CreateProjectUseCase {
  constructor(
    @inject(TYPES.IProjectRepository) private projectRepo: IProjectRepository
  ) {}

  async execute(dto: CreateProjectDTO): Promise<Project> {
    const project = await this.projectRepo.create(dto);
    return project;
  }
}
