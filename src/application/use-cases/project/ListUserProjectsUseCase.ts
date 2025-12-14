// src/application/use-cases/project/ListUserProjectsUseCase.ts
import type { IProjectRepository } from "@/application/repo/IProjectRepository";
import { TYPES } from "@/di/types";
import type { Project } from "@/domain/types/index.";
import { inject, injectable } from "inversify";

export interface ListUserProjectsInput {
  page: number;
  limit: number;
  search?: string;
}

export interface ListUserProjectsOutput {
  projects: Project[];
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

@injectable()
export class ListUserProjectsUseCase {
  constructor(
    @inject(TYPES.IProjectRepository)
    private projectRepo: IProjectRepository
  ) {}

  async execute(input: ListUserProjectsInput): Promise<ListUserProjectsOutput> {
    const response = this.projectRepo.getUserProjects(input);
    console.log(response);
    return response;
  }
}
