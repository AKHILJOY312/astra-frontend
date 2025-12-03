// src/presentation/components/user/modals/UpgradePlanModal.tsx
import { X, Sparkles, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeUpgradePlanModal } from "@/presentation/redux/slice/uiSlice";
import type { RootState } from "@/presentation/redux/store/store";
import { useNavigate } from "react-router-dom";

export default function UpgradePlanModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state: RootState) => state.ui.upgradePlanModal);

  const plans = [
    {
      id: "pro_monthly",
      name: "Pro",
      price: "₹799",
      desc: "Perfect for growing teams",
      features: [
        "Unlimited projects",
        "50 members per project",
        "Priority support",
      ],
    },
    {
      id: "team_yearly",
      name: "Team",
      price: "₹1,599/mo",
      desc: "Best value — save 33%",
      popular: true,
      features: [
        "Everything in Pro",
        "200 members per project",
        "SSO + SAML",
        "Dedicated manager",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      desc: "For large organizations",
      features: [
        "Unlimited everything",
        "Custom integrations",
        "24/7 phone support",
        "SLA",
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-8 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              You've reached your limit
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Upgrade to unlock unlimited projects and advanced features
            </p>
          </div>
          <button
            onClick={() => dispatch(closeUpgradePlanModal())}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative rounded-2xl p-8 border-2 transition-all hover:scale-105
                ${
                  plan.popular
                    ? "border-blue-600 shadow-xl bg-blue-50/50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {plan.desc}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  dispatch(closeUpgradePlanModal());
                  navigate("/upgrade");
                }}
                className={`
                  w-full py-4 rounded-xl font-semibold transition-all
                  ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  }
                `}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Upgrade Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
