import type { IProjectMembershipRepository } from "@/application/repo/IProjectMembershipRepository";
import { TYPES } from "@/di/types";
import type { ProjectMembership } from "@/domain/types/index.";
import { inject, injectable } from "inversify";
@injectable()
export class GetProjectMembersUseCase {
  constructor(
    @inject(TYPES.IProjectMembershipRepository)
    private membershipRepo: IProjectMembershipRepository
  ) {}

  async execute(projectId: string): Promise<ProjectMembership[]> {
    return await this.membershipRepo.getMembers(projectId);
  }
}
