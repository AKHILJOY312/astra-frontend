import {
  createRazorpayOrder,
  verifyPayment,
} from "@/services/subscription.service";
import { useState } from "react";
import axios from "axios";
// Razorpay handler response
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Razorpay options
interface RazorpayOptions {
  key: string;
  amount: number | string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
}

// Minimal Razorpay instance
interface RazorpayInstance {
  open: () => void;
}

// Expected order from your backend use case
interface RazorpayOrder {
  keyId: string;
  amount: number | string;
  currency: string;
  planName: string;
  razorpayOrderId: string;
}

// Payload for verification
interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

// Proper global augmentation for Razorpay (place this at the top level of the file)
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const useRazorpay = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | null
  >(null);

  // Discriminated union for payment details
  type PaymentDetails =
    | {
        type: "success";
        planName: string;
        amount: number;
        paymentId: string;
      }
    | { type: "error"; errorMessage: string }
    | { type: "initial" };

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    type: "initial",
  });

  const initiatePayment = async (planId: string) => {
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Failed to load Razorpay SDK");
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK did not initialize");
        return;
      }

      const response = await createRazorpayOrder(planId);
      const order: RazorpayOrder = response.data.data;

      const options: RazorpayOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Astra",
        description: `Upgrade to ${order.planName}`,
        order_id: order.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            } as VerifyPaymentPayload);

            setPaymentDetails({
              type: "success",
              planName: order.planName,
              amount: Number(order.amount),
              paymentId: response.razorpay_payment_id,
            });
            setPaymentStatus("success");
            setModalOpen(true);
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : "Verification failed";
            setPaymentDetails({ type: "error", errorMessage: message });
            setPaymentStatus("failed");
            setModalOpen(true);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentDetails({
              type: "error",
              errorMessage: "Payment cancelled",
            });
            setPaymentStatus("failed");
            setModalOpen(true);
          },
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: unknown) {
      let message = "Something went wrong";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setPaymentDetails({ type: "error", errorMessage: message });
      setPaymentStatus("failed");
      setModalOpen(true);
    }
  };

  return {
    initiatePayment,
    modalOpen,
    setModalOpen,
    paymentStatus,
    paymentDetails,
  };
};
