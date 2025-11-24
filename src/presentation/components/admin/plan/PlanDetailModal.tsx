// src/presentation/components/admin/plan/PlanDetailModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/admin/ui/modal/PlanModal";
import Button from "@/presentation/components/admin/ui/button/Button";
import Badge from "@/presentation/components/admin/ui/badge/Badge";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import type { Plan } from "@/domain/entities/plan/Plan";
import PlanFormDialog from "./PlanFormDialog";
import { useState } from "react";
import { container } from "@/di/container";
import { DeletePlanUseCase } from "@/application/use-cases/plan";
import { useQueryClient } from "@tanstack/react-query";

// CORRECT WAY: Use class as identifier (not string!)
const deletePlanUseCase = container.get(DeletePlanUseCase);

interface Props {
  plan: Plan;
  open: boolean;
  onClose: () => void;
}

export default function PlanDetailModal({ plan, open, onClose }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      console.log(plan.id);
      await deletePlanUseCase.execute(plan.id);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      onClose();
      setDeleteConfirmOpen(false);
    } catch (err) {
      alert("Failed to delete plan. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Main Detail Modal */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{plan.name}</DialogTitle>
            <div className="flex gap-3 mt-4">
              <Button size="sm" onClick={() => setEditOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Plan
              </Button>
              <Button
                size="sm"
                // variant="destructive"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Plan
              </Button>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1 font-medium">{plan.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Original Price</p>
                <p className="text-xl font-bold line-through text-gray-500">
                  {plan.currency} {(plan.price ?? 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Final Price</p>
                <p className="text-2xl font-bold text-green-600">
                  {plan.currency} {(plan.finalAmount ?? 0).toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    /{plan.billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <strong>Status:</strong>{" "}
                <Badge variant={plan.isActive ? "light" : "solid"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <strong>Billing:</strong> {plan.billingCycle}
              </div>
            </div>

            <div>
              <p className="font-medium mb-3">
                Features ({plan.features?.length || 0})
              </p>
              <div className="flex flex-wrap gap-2">
                {(plan.features || []).map((feature, i) => (
                  <Badge key={i} variant="light">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
              <p>
                Max Projects:{" "}
                {plan.maxProjects === 0 ? "Unlimited" : plan.maxProjects}
              </p>
              <p>
                Max Storage:{" "}
                {plan.maxStorage === 0 ? "Unlimited" : `${plan.maxStorage} GB`}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <PlanFormDialog
        plan={plan}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle>Delete Plan Permanently?</DialogTitle>
            </div>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete the plan{" "}
              <strong>{plan.name}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone. All subscriptions using this plan
              will be affected.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              //   variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Plan"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
