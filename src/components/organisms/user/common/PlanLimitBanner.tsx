// src/components/user/project/PlanLimitBanner.tsx
import { AlertCircle, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { openUpgradePlanModal } from "@/redux/slice/uiSlice";
import { useDispatch } from "react-redux";

export function PlanLimitBanner() {
  const dispatch = useDispatch();
  const { limits, currentPlan } = useSelector((state: RootState) => ({
    limits: state.project.limits,
    currentPlan: state.project.currentPlan,
  }));

  const { projects } = useSelector((state: RootState) => state.project);

  if (!limits || projects.length < limits.maxProjects * 0.8) return null;

  const percentage = Math.round((projects.length / limits.maxProjects) * 100);

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-300">
              {projects.length} / {limits.maxProjects} projects used (
              {percentage}%)
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              You're running out of project slots on the{" "}
              {currentPlan?.name || "Free"} plan
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(openUpgradePlanModal())}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
