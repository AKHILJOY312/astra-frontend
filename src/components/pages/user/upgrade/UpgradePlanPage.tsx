import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { PaymentStatusModal } from "@/components/atoms/admin/modal/PaymentStatusModal";
import { getAvailablePlans } from "@/services/plan.service";

import type { UserPlanList } from "@/types";
import { PricingCard } from "@/components/molecules/user/plan/PricingCard";
import { showAlert } from "@/redux/slice/uiSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function UpgradePlanPage() {
  const [plans, setPlans] = useState<UserPlanList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const currentPlan = plans.find((p) => p.isCurrent);
  const currentPrice = currentPlan?.finalAmount ?? 0;
  const {
    initiatePayment,
    modalOpen,
    setModalOpen,
    paymentStatus,
    paymentDetails,
  } = useRazorpay();
  const dispatch = useAppDispatch();

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAvailablePlans();
      setPlans(response.data.plans || []);
    } catch {
      setError("Failed to load plans. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (paymentStatus === "success") fetchPlans();
  }, [paymentStatus, fetchPlans]);

  const handleUpgrade = (planId: string) => {
    try {
      setSelectedPlanId(planId);
      initiatePayment(planId);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Payment initiation failed. Please try again";
      dispatch(
        showAlert({
          type: "error",
          message: message,
        }),
      );
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 py-16 px-4">
      <header className="text-center max-w-5xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Unlock more projects, invite your team, and supercharge your
          productivity
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            currentPlanPrice={currentPrice}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>

      <footer className="text-center mt-20">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Secured by Razorpay • Cancel anytime • No hidden fees
        </p>
      </footer>

      {modalOpen && (
        <PaymentStatusModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          status={paymentStatus}
          details={{
            ...paymentDetails,
            plan: plans.find((p) => p.id === selectedPlanId),
          }}
          onRetry={async () =>
            selectedPlanId && initiatePayment(selectedPlanId)
          }
        />
      )}
    </div>
  );
}

// Small helper components to keep the main return clean
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400 text-xl font-medium">
    {message}
  </div>
);
