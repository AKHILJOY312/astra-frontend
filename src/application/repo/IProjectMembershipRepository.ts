// src/application/repo/ProjectMembershipRepository.ts
import { ProjectMembership } from "../../domain/entities/project/ProjectMembership";
import type { AddMemberDTO } from "../use-cases/index";

export interface IProjectMembershipRepository {
  addMember(
    projectId: string,
    email: string,
    role: string
  ): Promise<ProjectMembership>;
  getMembers(projectId: string): Promise<ProjectMembership[]>;
}
