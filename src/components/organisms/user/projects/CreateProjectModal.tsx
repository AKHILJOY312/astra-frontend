// src/components/user/modals/CreateProjectModal.tsx
import { X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCreateProjectModal,
  openUpgradePlanModal,
} from "@/redux/slice/uiSlice";
import type { RootState } from "@/redux/store/store";
import { useProjects } from "@/hooks/useProjects";
import { setProjectError } from "@/redux/slice/projectSlice";

import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";

export default function CreateProjectModal() {
  const dispatch = useDispatch();
  const { createProject, loading } = useProjects();
  const isOpen = useSelector((state: RootState) => state.ui.createProjectModal);
  const error = useSelector((state: RootState) => state.project.error); // assuming error is in project slice

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Project name is required")
      .min(3, "Project name must have at least 3 letter")
      .max(15, "Project name must be at most 15 characters"),
    description: Yup.string()
      .trim()
      .max(500, "Description must be at most 500 characters"),
    imageUrl: Yup.string().url("Must be a valid URL").nullable(),
  });

  // Initial values
  const initialValues = {
    name: "",
    description: "",
    imageUrl: null as string | null,
  };

  interface BackendError {
    response?: {
      data?: {
        error?: string;
        upgradeRequired?: boolean;
        message?: string;
      };
    };
    message?: string;
  }

  type FormValues = typeof initialValues;

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      await createProject(
        values.name.trim(),
        values.description.trim() || undefined,
        values.imageUrl
      );

      resetForm();
      dispatch(closeCreateProjectModal());
    } catch (err: unknown) {
      let backendMessage = "Failed to create project";
      console.log("working2");
      let upgradeRequired = false;
      if (typeof err === "object" && err !== null) {
        const e = err as BackendError;
        const res = e.response?.data;

        if (res?.error) backendMessage = res.error;
        if (res?.upgradeRequired === true) upgradeRequired = true;
        if (res?.message && !res?.error) backendMessage = res.message;
      }

      if (upgradeRequired) {
        dispatch(openUpgradePlanModal());
      }

      dispatch(setProjectError(backendMessage));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Project
          </h2>
          <button
            onClick={() => dispatch(closeCreateProjectModal())}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Field
                  name="name"
                  type="text"
                  placeholder="e.g. Marketing Campaign 2025"
                  autoFocus
                  className="w-full text-black px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={3}
                  placeholder="What is this project about?"
                  className="w-full px-4 py-3 text-black rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => dispatch(closeCreateProjectModal())}
                  className="flex-1 py-3 text-black rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading || !isValid || !dirty}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting || loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
