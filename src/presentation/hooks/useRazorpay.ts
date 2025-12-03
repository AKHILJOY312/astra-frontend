import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateRazorpayOrderUseCase } from "@/application/use-cases/upgradeplan/CreateRazorpayOrderUseCase";
import { VerifyPaymentUseCase } from "@/application/use-cases/upgradeplan/VerifyPaymentUseCase";

import { useState } from "react";
export const loadRazorpay = () => {
  return new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);

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
  const [paymentDetails, setPaymentDetails] = useState<any>({});

  const createOrder = container.get<CreateRazorpayOrderUseCase>(
    TYPES.CreateRazorpayOrderUseCase
  );

  const verifyPayment = container.get<VerifyPaymentUseCase>(
    TYPES.VerifyPaymentUseCase
  );

  const initiatePayment = async (planId: string) => {
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Failed to load Razorpay SDK");
        return;
      }

      if (!(window as any).Razorpay) {
        alert("Razorpay SDK did not initialize");
        return;
      }

      const order = await createOrder.execute(planId);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Astra",
        description: `Upgrade to ${order.planName}`,
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            await verifyPayment.execute({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setPaymentDetails({
              planName: order.planName,
              amount: order.amount,
              paymentId: response.razorpay_payment_id,
            });
            setPaymentStatus("success");
            setModalOpen(true);
          } catch (err: any) {
            setPaymentStatus("failed");
            setPaymentDetails({
              errorMessage: err.message || "Verification failed",
            });
            setModalOpen(true);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus("failed");
            setPaymentDetails({ errorMessage: "Payment cancelled" });
            setModalOpen(true);
          },
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      setPaymentStatus("failed");
      setPaymentDetails({ errorMessage: error.message });
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
