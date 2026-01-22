// src/presentation/pages/user/UpgradePlanPage.tsx
import { useEffect, useState } from "react";
import { Check, Sparkles, Loader2, Crown } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { PaymentStatusModal } from "@/components/atoms/admin/modal/PaymentStatusModal";
import type { UserPlanList } from "@/types";
import { getAvailablePlans } from "@/services/plan.service";

export default function UpgradePlanPage() {
  const [plans, setPlans] = useState<UserPlanList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const {
    initiatePayment,
    modalOpen,
    setModalOpen,
    paymentStatus,
    paymentDetails,
  } = useRazorpay();
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getAvailablePlans();
      setPlans(response.data.plans || []);
    } catch {
      setError("Failed to load plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAvailablePlans()
      .then((response) => {
        setPlans(response.data.plans || []);
      })
      .catch(() => setError("Failed to load plans. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (paymentStatus === "success") {
      fetchPlans();
    }
  }, [paymentStatus]);

  const handleUpgrade = async (planId: string) => {
    try {
      setSelectedPlanId(planId);
      initiatePayment(planId);
    } catch (error) {
      const errors = error as Error;
      alert(errors?.message || "Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400 text-xl font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 py-16 px-4">
      {/* Header */}
      <div className="text-center max-w-5xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Unlock more projects, invite your team, and supercharge your
          productivity
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => {
          const isFree = plan.id === "free";
          const isPro = plan.name === "Pro";
          const isCurrent = plan.isCurrent;

          const hasDiscount = plan.price > plan.finalAmount;

          return (
            <div
              key={plan.id}
              className={`relative group transition-all duration-500 hover:-translate-y-4 ${
                isPro ? "lg:scale-110 z-10" : ""
              }`}
            >
              {plan.isCurrent && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                  CURRENT
                </div>
              )}

              {/* Most Popular Badge */}
              {isPro && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-linear-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl">
                    <Sparkles className="w-5 h-5" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative rounded-3xl p-8 h-full overflow-hidden transition-all duration-300 ${
                  isPro
                    ? "bg-linear-to-br from-purple-600 via-purple-700 to-pink-600 text-white shadow-2xl "
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200 dark:border-gray-700"
                }
                ${
                  plan.isCurrent
                    ? "ring-2 ring-green-400 bg-green-50 dark:bg-green-900/20"
                    : ""
                }
                `}
              >
                {/* Plan Name */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    {plan.name}
                    {isPro && <Crown className="w-7 h-7 text-yellow-300" />}
                  </h3>
                  {plan.description && (
                    <p
                      className={`text-sm ${
                        isPro
                          ? "text-purple-100"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="text-center mb-10">
                  {isFree ? (
                    <div className="text-5xl font-extrabold">Free Forever</div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-extrabold">
                          ₹{plan.finalAmount.toLocaleString()}
                        </span>
                        <span
                          className={`${
                            isPro ? "text-purple-200" : "text-gray-500"
                          }`}
                        >
                          /month
                        </span>
                      </div>
                      {hasDiscount && (
                        <p
                          className={`text-sm mt-3 ${
                            isPro ? "text-purple-200" : "text-gray-500"
                          }`}
                        >
                          <del>₹{plan.price.toLocaleString()}</del>{" "}
                          <span className="text-green-400 font-bold">
                            Save ₹{plan.price - plan.finalAmount}!
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          isPro ? "text-pink-200" : "text-green-500"
                        }`}
                      />
                      <span className={isPro ? "text-purple-50" : ""}>
                        {feature}
                      </span>
                    </li>
                  ))}

                  <div
                    className={`pt-4 border-t ${
                      isPro
                        ? "border-purple-400/40"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <li className="flex items-center gap-3">
                      <Check
                        className={`w-5 h-5 shrink-0 ${
                          isPro ? "text-pink-200" : "text-green-500"
                        }`}
                      />
                      <span
                        className={`font-semibold ${isPro ? "text-white" : ""}`}
                      >
                        {plan.maxProjects === -1
                          ? "Unlimited"
                          : plan.maxProjects}{" "}
                        Projects
                      </span>
                    </li>
                    <li className="flex items-center gap-3 mt-3">
                      <Check
                        className={`w-5 h-5 shrink-0 ${
                          isPro ? "text-pink-200" : "text-green-500"
                        }`}
                      />
                      <span
                        className={`font-semibold ${isPro ? "text-white" : ""}`}
                      >
                        {plan.maxMembersPerProject === -1
                          ? "Unlimited"
                          : plan.maxMembersPerProject}{" "}
                        Members per Project
                      </span>
                    </li>
                  </div>
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => !isCurrent && handleUpgrade(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                      : isPro
                      ? "bg-white text-purple-700 hover:bg-gray-100 shadow-lg"
                      : "bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                  }`}
                >
                  {isCurrent
                    ? "Your Current Plan"
                    : isPro
                    ? "Upgrade to Pro"
                    : "Upgrade"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Footer */}
      <div className="text-center mt-20">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Secured by Razorpay • Cancel anytime • No hidden fees
        </p>
      </div>
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
