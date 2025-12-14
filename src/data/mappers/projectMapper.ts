import { Project } from "../../domain/entities/project/Project";

export const projectResponseToEntity = (raw: any): Project => {
  return new Project({
    id: raw._id || raw.id,
    projectName: raw.projectName,
    description: raw.description ?? "",
    imageUrl: raw.imageUrl ?? null,
    ownerId: raw.ownerId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
};
