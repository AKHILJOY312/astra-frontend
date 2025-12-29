import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogDescription,
  // DialogFooter,
  DialogOverlay,
  DialogClose,
} from "@/components/atoms/dialogue/index";
import Button from "@/components/atoms/button/Button";
// import { X } from "lucide-react";
import type { Plan } from "@/types";

interface PaymentDetails {
  planName?: string;
  amount?: number; // in paise
  paymentId?: string;
  date?: string;
  errorMessage?: string;
  plan?: Plan;
}

interface Props {
  open: boolean;
  status: "success" | "failed" | null;
  details: PaymentDetails;
  onClose: () => void;
  onRetry?: () => void;
}

export const PaymentStatusModal: React.FC<Props> = ({
  open,
  status,
  details,
  onClose,
  onRetry,
}) => {
  if (!status) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* BACKDROP BLUR */}
      <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-9998" />

      <DialogContent className="fixed z-9999 max-w-md bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl">
        {/* CLOSE BUTTON */}
        <DialogClose className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"></DialogClose>

        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {status === "success"
              ? "Payment Successful 🎉"
              : "Payment Failed ❌"}
          </DialogTitle>
        </DialogHeader>

        {/* SUCCESS */}
        {status === "success" ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your payment has been processed successfully.
            </p>

            <div className="bg-gray-100 p-4 rounded-md text-sm text-black space-y-1">
              <p>
                <b>Plan:</b> {details?.planName}
              </p>
              <p>
                <b>Amount:</b> ₹{(details.amount || 0) / 100}
              </p>
              <p>
                <b>Payment ID:</b> {details?.paymentId}
              </p>
              <p>
                <b>Date:</b> {new Date().toLocaleString()}
              </p>
            </div>

            <Button onClick={() => (window.location.href = "/projects")}>
              Go to Projects
            </Button>
          </div>
        ) : (
          /* FAILURE */
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Something went wrong with the payment.
            </p>

            <div className="bg-red-100 p-3 rounded-md text-sm text-red-700">
              {details?.errorMessage || "Unknown error occurred."}
            </div>

            <div className="flex gap-2">
              <Button onClick={onRetry}>Retry Payment</Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/projects")}
              >
                Go to Projects
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
