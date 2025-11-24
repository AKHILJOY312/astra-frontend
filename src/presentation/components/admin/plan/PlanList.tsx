// src/presentation/components/admin/plan/PlanList.tsx
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { container } from "@/di/container";
import { GetPlansUseCase } from "@/application/use-cases/plan";
import type { Plan } from "@/domain/entities/plan/Plan";
import PlanCard from "./PlanCard";
import PlanDetailModal from "./PlanDetailModal";
import { useState } from "react";
import { Package } from "lucide-react";

const getPlansUseCase = container.get(GetPlansUseCase);

export default function PlanList() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["plans"],
    queryFn: ({ pageParam = 1 }) => getPlansUseCase.execute(pageParam, 12),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages, allPagesCount) => {
      if (lastPage.data.length < 12) {
        return undefined;
      }

      const nextPage = allPages.length + 1;

      return nextPage;
    },
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px", // trigger a bit earlier
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const plans = data?.pages.flatMap((page) => page.data) ?? [];

  // Loading (first load)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading plans...</p>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load plans: {(error as Error)?.message}
      </div>
    );
  }

  // Empty state
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="w-20 h-20 text-gray-400 mb-6" />
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          No Plans Yet
        </h3>
        <p className="text-gray-500 mt-2 max-w-md">
          Create your first subscription plan to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger – ONLY when hasNextPage */}
      {hasNextPage && (
        <div ref={ref} className="py-12 flex justify-center">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-9 w-9 border-t-4 border-b-4 border-primary"></div>
              <span className="text-gray-600">Loading more...</span>
            </div>
          ) : (
            <div className="h-1" />
          )}
        </div>
      )}

      {/* End of list */}
      {!hasNextPage && plans.length > 0 && (
        <div className="text-center py-10 text-gray-500">
          You've seen all plans
        </div>
      )}

      {/* Modal */}
      {selectedPlan && (
        <PlanDetailModal
          plan={selectedPlan}
          open={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </>
  );
}
