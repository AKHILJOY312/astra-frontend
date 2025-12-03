import { Plan, type PlanProps } from "@/domain/entities/plan/Plan";

export const planResponseToEntity = (raw: any): Plan => {
  const props: PlanProps = {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",
    price: raw.price,
    finalAmount: raw.finalAmount,
    currency: raw.currency,
    billingCycle: raw.billingCycle,
    features: raw.features ?? [],
    maxProjects: raw.maxProjects,
    maxMembersPerProject: raw.maxMembersPerProject,
    isActive: raw.isActive,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };

  return new Plan(props);
};
