// src/application/use-cases/project/AddMemberUseCase.ts

import type { IProjectMembershipRepository } from "@/application/repo/IProjectMembershipRepository";
import { TYPES } from "@/di/types";
import type { ProjectMembership } from "@/domain/types/index.";
import { inject, injectable } from "inversify";

export interface AddMemberDTO {
  projectId: string;
  userEmail: string;
  role?: "member" | "lead" | "manager";
}
@injectable()
export class AddMemberUseCase {
  constructor(
    @inject(TYPES.IProjectMembershipRepository)
    private membershipRepo: IProjectMembershipRepository
  ) {}

  async execute(dto: AddMemberDTO): Promise<ProjectMembership> {
    const { projectId, userEmail, role = "member" } = dto;
    return await this.membershipRepo.addMember(projectId, userEmail, role);
  }
}
