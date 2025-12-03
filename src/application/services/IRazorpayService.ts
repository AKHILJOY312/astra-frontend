export interface CreateOrderInput {
  planId: string;
}

export interface CreateOrderOutput {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface IRazorpayService {
  createOrder(input: CreateOrderInput): Promise<CreateOrderOutput>;
  verifyPaymentSignature(input: VerifyPaymentInput): boolean;
}
