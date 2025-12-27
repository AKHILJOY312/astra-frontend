// src/presentation/hooks/usePlanLimits.ts
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/redux/store/store";
import { openUpgradePlanModal } from "@/redux/slice/uiSlice";
import { setPlanLimits } from "@/redux/slice/projectSlice";
import { getCurrentPlan, getPlanLimits } from "@/services/plan.service";

export const usePlanLimits = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, limits } = useSelector((state: RootState) => state.project);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlanData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [limitsData, planData] = await Promise.all([
        getPlanLimits(),
        getCurrentPlan(),
      ]);

      dispatch(
        setPlanLimits({ limits: limitsData.data, currentPlan: planData.data })
      );

      // Auto-open upgrade modal if user has reached limit
      if (limitsData.data.currentProjects >= limitsData.data.maxProjects) {
        dispatch(openUpgradePlanModal());
      }
    } catch (error) {
      const err = error as Error;
      setError(err.message || "Failed to load plan limits");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadPlanData();
  }, [loadPlanData]);

  // re-check on projects change
  useEffect(() => {
    if (limits && projects.length >= limits.maxProjects) {
      dispatch(openUpgradePlanModal());
    }
  }, [projects.length, limits, dispatch]);

  const hasReachedProjectLimit = limits
    ? projects.length >= limits.maxProjects
    : false;
  const hasReachedMemberLimit = (membersCount: number) =>
    limits ? membersCount >= limits.maxMembersPerProject : false;

  return {
    limits,
    loading,
    error,
    hasReachedProjectLimit,
    hasReachedMemberLimit,
    refresh: loadPlanData,
  };
};
