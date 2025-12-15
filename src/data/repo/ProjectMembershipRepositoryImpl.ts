// src/data/repo/ProjectMembershipRepositoryImpl.ts
import type { IProjectMembershipRepository } from "../../application/repo/IProjectMembershipRepository";
import { ProjectMembership } from "../../domain/entities/project/ProjectMembership";
import * as membershipApi from "../api/membershipApi";

export class ProjectMembershipRepositoryImpl
  implements IProjectMembershipRepository
{
  async addMember(
    projectId: string,
    userEmail: string,
    role: "member" | "lead" | "manager"
  ): Promise<ProjectMembership> {
    const { data } = await membershipApi.addMember(projectId, {
      userEmail,
      role,
    });
    return new ProjectMembership(data);
  }

  async getMembers(projectId: string) {
    const { data } = await membershipApi.getProjectMembers(projectId);
    return data.data;
  }

  async removeMember(projectId: string, memberId: string): Promise<void> {
    await membershipApi.removeMember(projectId, memberId);
  }

  async changeRole(
    projectId: string,
    memberId: string,
    role: "member" | "lead" | "manager"
  ): Promise<void> {
    await membershipApi.changeMemberRole(projectId, memberId, role);
  }
}
