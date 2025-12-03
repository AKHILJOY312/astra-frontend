// src/domain/entities/plan/Plan.ts

export interface PlanProps {
  id: string;
  name: string;
  description: string;
  price: number;
  finalAmount: number;
  currency: "INR" | "USD" | "EUR";
  billingCycle: "monthly" | "yearly";
  features: string[];
  maxProjects: number;
  maxMembersPerProject: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Plan {
  private readonly props: PlanProps;

  constructor(props: PlanProps) {
    this.props = Object.freeze({ ...props }); // immutable
  }

  // Getters — clean and safe
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get price() {
    return this.props.price;
  }
  get finalAmount() {
    return this.props.finalAmount;
  }
  get currency() {
    return this.props.currency;
  }
  get billingCycle() {
    return this.props.billingCycle;
  }
  get features() {
    return [...this.props.features];
  } // clone array
  get maxProjects() {
    return this.props.maxProjects;
  }
  get maxMembersPerProject() {
    return this.props.maxMembersPerProject;
  }
  get isActive() {
    return this.props.isActive;
  }
  get createdAt() {
    return new Date(this.props.createdAt);
  }
  get updatedAt() {
    return new Date(this.props.updatedAt);
  }

  get billingText(): string {
    return `/${this.billingCycle === "monthly" ? "month" : "year"}`;
  }

  toJSON() {
    return { ...this.props };
  }
}
