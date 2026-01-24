import { Check, Sparkles, Crown } from "lucide-react";
import type { UserPlanList } from "@/types";

interface PricingCardProps {
  plan: UserPlanList;
  currentPlanPrice: number; // Pass the price of the plan where isCurrent is true
  onUpgrade: (id: string) => void;
}

export function PricingCard({
  plan,
  currentPlanPrice,
  onUpgrade,
}: PricingCardProps) {
  const isFree = plan.id === "free";
  const isPro = plan.name === "Pro";
  const isCurrent = plan.isCurrent;
  const isLowerPlan = !isCurrent && plan.finalAmount < currentPlanPrice;
  const hasDiscount = plan.price > plan.finalAmount;

  return (
    <div
      className={`relative group transition-all duration-500 hover:-translate-y-4 flex flex-col ${isPro ? "lg:scale-110 z-10" : ""}`}
    >
      {isCurrent && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow z-20">
          CURRENT
        </div>
      )}

      {isPro && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <span className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl whitespace-nowrap">
            <Sparkles className="w-5 h-5" /> MOST POPULAR
          </span>
        </div>
      )}

      {/* Main Card Container */}
      <div
        className={`relative rounded-3xl p-8 h-full flex flex-col overflow-hidden transition-all duration-300 ${
          isPro
            ? "bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white shadow-2xl"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200 dark:border-gray-700"
        } ${isCurrent ? "ring-2 ring-green-400 bg-green-50 dark:bg-green-900/20" : ""}`}
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            {plan.name} {isPro && <Crown className="w-7 h-7 text-yellow-300" />}
          </h3>
          {plan.description && (
            <p
              className={`text-sm min-h-[40px] ${isPro ? "text-purple-100" : "text-gray-600 dark:text-gray-400"}`}
            >
              {plan.description}
            </p>
          )}
        </div>

        <div className="text-center mb-10">
          {isFree ? (
            <div className="text-4xl font-extrabold py-2">Free Forever</div>
          ) : (
            <div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-extrabold">
                  ₹{plan.finalAmount.toLocaleString()}
                </span>
                <span className={isPro ? "text-purple-200" : "text-gray-500"}>
                  /month
                </span>
              </div>
              <div className="min-h-[20px] mt-3">
                {hasDiscount && (
                  <p
                    className={`text-sm ${isPro ? "text-purple-200" : "text-gray-500"}`}
                  >
                    <del>₹{plan.price.toLocaleString()}</del>{" "}
                    <span className="text-green-400 font-bold">
                      Save ₹{plan.price - plan.finalAmount}!
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Feature List */}
        <ul className="space-y-4 mb-10 flex-grow">
          {plan.features.map((feature, i) => (
            <FeatureItem key={i} isPro={isPro}>
              {feature}
            </FeatureItem>
          ))}
          <div
            className={`pt-4 border-t ${isPro ? "border-purple-400/40" : "border-gray-300 dark:border-gray-600"}`}
          >
            <FeatureItem isPro={isPro} bold>
              {plan.maxProjects === -1 ? "Unlimited" : plan.maxProjects}{" "}
              Projects
            </FeatureItem>
            <FeatureItem isPro={isPro} bold className="mt-3">
              {plan.maxMembersPerProject === -1
                ? "Unlimited"
                : plan.maxMembersPerProject}{" "}
              Members
            </FeatureItem>
          </div>
        </ul>

        {/* CTA Button: mt-auto ensures it sits at the bottom */}
        <div className="mt-auto">
          {isLowerPlan ? (
            <div className="w-full py-4 text-center text-gray-400 dark:text-gray-500 font-medium italic">
              Included in your current plan
            </div>
          ) : (
            <button
              onClick={() => !isCurrent && onUpgrade(plan.id)}
              disabled={isCurrent}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                isCurrent
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default"
                  : isPro
                    ? "bg-white text-purple-700 hover:bg-gray-100 shadow-lg"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg"
              }`}
            >
              {isCurrent ? "Active Plan" : isPro ? "Get Pro Now" : "Upgrade"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  children: React.ReactNode;
  isPro: boolean;
  bold?: boolean;
  className?: string;
}

function FeatureItem({
  children,
  isPro,
  bold,
  className = "",
}: FeatureItemProps) {
  return (
    <li className={`flex items-start gap-3 ${className}`}>
      <Check
        className={`w-5 h-5 shrink-0 mt-0.5 ${isPro ? "text-pink-200" : "text-green-500"}`}
      />
      <span
        className={`${isPro ? "text-purple-50" : ""} ${bold ? "font-semibold" : ""}`}
      >
        {children}
      </span>
    </li>
  );
}
