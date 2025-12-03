export interface UserSubscriptionProps {
  planId: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentId?: string;
  status: "pending" | "active" | "failed";
}

export class UserSubscription {
  constructor(private props: UserSubscriptionProps) {}

  get planId() {
    return this.props.planId;
  }
  get orderId() {
    return this.props.orderId;
  }
  get amount() {
    return this.props.amount;
  }
  get currency() {
    return this.props.currency;
  }
  get paymentId() {
    return this.props.paymentId;
  }
  get status() {
    return this.props.status;
  }
}
