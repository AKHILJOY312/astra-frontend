import Badge from "@/components/organisms/admin/ui/badge/Badge";
import { Card, CardContent } from "@/components/organisms/admin/ui/card";
import type { Plan } from "@/types";
import { IndianRupee, DollarSign, Euro } from "lucide-react";

const currencyIcons: Record<"INR" | "USD" | "EUR", JSX.Element> = {
  INR: <IndianRupee className="w-4 h-4" />,
  USD: <DollarSign className="w-4 h-4" />,
  EUR: <Euro className="w-4 h-4" />,
};

export default function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-white/[0.05] cursor-pointer group">
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white/90">
            {plan.name}
          </h3>
          <Badge variant={plan.isActive ? "light" : "solid"}>
            {plan.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1 text-2xl font-bold text-primary">
            {currencyIcons[plan.currency]}
            {(plan.finalAmount ?? 0).toLocaleString()}
            <span className="text-sm font-normal text-gray-500">
              /{plan.billingCycle === "monthly" ? "mo" : "yr"}
            </span>
          </div>
          {plan.price !== plan.finalAmount && (
            <p className="text-sm text-gray-500 line-through">
              {currencyIcons[plan.currency]}{" "}
              {(plan.price ?? 0).toLocaleString()}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {plan.description}
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span>
            Projects: {plan.maxProjects === 0 ? "Unlimited" : plan.maxProjects}
          </span>
          <span>
            People:{" "}
            {plan.maxMembersPerProject === 0
              ? "Unlimited"
              : `${plan.maxMembersPerProject} No`}
          </span>
        </div>

        <div className="mt-4 flex gap-2 opacity-0 group2 group-hover:opacity-100 transition-opacity">
          <Badge variant="light">{plan.features?.length || 0} features</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
