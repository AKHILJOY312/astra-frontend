// src/presentation/components/admin/plan/PlanFormDialog.tsx
"use client";

import { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/admin/ui/modal/PlanModal";
import Button from "@/presentation/components/admin/ui/button/Button";
import Input from "@/presentation/components/admin/form/input/InputField";
import Label from "@/presentation/components/admin/form/Label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/presentation/components/admin/ui/select";
import { X, Plus } from "lucide-react";
import type { Plan } from "@/domain/entities/plan/Plan";
import { container } from "@/di/container";
import {
  CreatePlanUseCase,
  UpdatePlanUseCase,
} from "@/application/use-cases/plan";
import { useQueryClient } from "@tanstack/react-query";

const createPlanUseCase = container.get(CreatePlanUseCase);
const updatePlanUseCase = container.get(UpdatePlanUseCase);

interface Props {
  plan?: Plan | null;
  open: boolean;
  onClose: () => void;
}

// ──────────────────────────────────────────────────────────────
// Schema & Types — features is now 100% string[]
// ──────────────────────────────────────────────────────────────
const planSchema = Yup.object()
  .shape({
    name: Yup.string().required("Plan name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().min(0, "Price must be positive").required(),
    finalAmount: Yup.number()
      .min(0, "Final amount must be positive")
      .required(),
    currency: Yup.mixed<"INR" | "USD" | "EUR">()
      .oneOf(["INR", "USD", "EUR"] as const)
      .required(),
    billingCycle: Yup.mixed<"monthly" | "yearly">()
      .oneOf(["monthly", "yearly"] as const)
      .required(),
    features: Yup.array()
      .of(Yup.string().required("Feature cannot be empty"))
      .min(1, "At least one feature is required")
      .required("Features are required"),
    maxProjects: Yup.number().min(0).required(),
    maxStorage: Yup.number().min(0).required(),
    isActive: Yup.boolean().default(true),
  })
  .required();

type FormValues = {
  name: string;
  description: string;
  price: number;
  finalAmount: number;
  currency: "INR" | "USD" | "EUR";
  billingCycle: "monthly" | "yearly";
  features: string[];
  maxProjects: number;
  maxStorage: number;
  isActive: boolean;
};

export default function PlanFormDialog({ plan, open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues: FormValues = {
    name: plan?.name || "",
    description: plan?.description || "",
    price: plan?.price || 0,
    finalAmount: plan?.finalAmount || 0,
    currency: plan?.currency || "INR",
    billingCycle: plan?.billingCycle || "monthly",
    features: plan?.features && plan.features.length > 0 ? plan.features : [""],
    maxProjects: plan?.maxProjects || 0,
    maxStorage: plan?.maxStorage || 0,
    isActive: plan?.isActive ?? true,
  };

  const handleSubmit = async (values: FormValues) => {
    setSubmitError(null);

    try {
      const cleanedValues = {
        ...values,
        features: values.features.filter((f) => f.trim() !== ""),
      };

      if (plan) {
        // FIX: Explicitly check for ID before calling use case
        const planId = plan.id;

        if (!planId) {
          console.error(
            "CRITICAL ERROR: Plan ID is missing in update mode. Aborting update."
          );
          setSubmitError(
            "Cannot update plan: The plan ID could not be found. Please refresh the list and try again."
          );
          return;
        }

        await updatePlanUseCase.execute(planId, cleanedValues);
      } else {
        await createPlanUseCase.execute(cleanedValues);
      }

      queryClient.invalidateQueries({ queryKey: ["plans"] });
      onClose();
    } catch (err: any) {
      // ⚠️ PHASE 3 DEBUG LOG: Full error object on API failure
      console.error("DEBUG: Submission failed. Full Error Object:", err);
      setSubmitError(err?.response?.data?.message || "Failed to save plan");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {plan ? "Edit Plan" : "Create New Plan"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={planSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Field as={Input} name="name" placeholder="e.g. Pro Plan" />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Field name="currency">
                    {({ field, form }: any) => (
                      <Select
                        value={field.value}
                        onValueChange={(v) => form.setFieldValue("currency", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                </div>

                <div>
                  <Label htmlFor="price">Original Price</Label>
                  <Field as={Input} type="number" name="price" />
                  {errors.price && touched.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="finalAmount">Final Amount</Label>
                  <Field as={Input} type="number" name="finalAmount" />
                  {errors.finalAmount && touched.finalAmount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.finalAmount}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Field name="billingCycle">
                    {({ field, form }: any) => (
                      <Select
                        value={field.value}
                        onValueChange={(v) =>
                          form.setFieldValue("billingCycle", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                </div>

                <div className="flex items-center space-x-3">
                  <Field
                    type="checkbox"
                    name="isActive"
                    className="w-5 h-5 text-primary rounded border-gray-300"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active Plan
                  </Label>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Field
                  as="textarea"
                  name="description"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Describe this plan..."
                />
                {errors.description && touched.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <Label>Features</Label>
                <FieldArray name="features">
                  {({ push, remove }) => (
                    <div className="space-y-3 mt-2">
                      {values.features.map((_, index) => (
                        <div key={index} className="flex gap-3">
                          <Field
                            as={Input}
                            name={`features.${index}`}
                            placeholder="e.g. Unlimited Projects"
                            className="flex-1"
                          />
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => push("")}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  )}
                </FieldArray>
                {errors.features && touched.features && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof errors.features === "string"
                      ? errors.features
                      : "Please add at least one feature"}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Max Projects (0 = Unlimited)</Label>
                  <Field as={Input} type="number" name="maxProjects" />
                </div>
                <div>
                  <Label>Max Storage (GB, 0 = Unlimited)</Label>
                  <Field as={Input} type="number" name="maxStorage" />
                </div>
              </div>

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : plan ? (
                    "Update Plan"
                  ) : (
                    "Create Plan"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
