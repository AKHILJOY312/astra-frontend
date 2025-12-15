import type { IProjectMembershipRepository } from "@/application/repo/IProjectMembershipRepository";
import { TYPES } from "@/di/types";
import { inject, injectable } from "inversify";

// ProjectMemberView
export interface ProjectMemberView {
  id: string;
  role: "manager" | "lead" | "member";
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@injectable()
export class GetProjectMembersUseCase {
  constructor(
    @inject(TYPES.IProjectMembershipRepository)
    private membershipRepo: IProjectMembershipRepository
  ) {}

  async execute(projectId: string): Promise<ProjectMemberView[]> {
    const members = await this.membershipRepo.getMembers(projectId);

    return members.map((m: any) => ({
      id: m.id,
      role: m.role,
      joinedAt: m.joinedAt,
      user: {
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
      },
    }));
  }
}
