// src/components/user/modals/CreateProjectModal.tsx
import { X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCreateProjectModal,
  openUpgradePlanModal,
} from "@/redux/slice/uiSlice";
import type { RootState } from "@/redux/store/store";
import { useProjects } from "@/hooks/useProjects";
import { useState } from "react";
import { setProjectError } from "@/redux/slice/projectSlice";

export default function CreateProjectModal() {
  const dispatch = useDispatch();
  const { createProject, loading, error } = useProjects();
  const isOpen = useSelector((state: RootState) => state.ui.createProjectModal);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createProject(
        name.trim(),
        description.trim() || undefined,
        imageUrl
      );
      setName("");
      setDescription("");
      setImageUrl(null);
      dispatch(closeCreateProjectModal());
    } catch (err: unknown) {
      let backendMessage = "Failed to create project";
      let upgradeRequired = false;

      // Narrow the type safely
      if (typeof err === "object" && err !== null) {
        const e = err as BackendError;

        const res = e.response?.data;

        if (res?.error) backendMessage = res.error;
        if (res?.upgradeRequired === true) upgradeRequired = true;

        if (e.message && !res?.error && e.response?.data?.message) {
          backendMessage = e.response?.data?.message;
        }
      }

      if (upgradeRequired) {
        dispatch(openUpgradePlanModal());
      }

      dispatch(setProjectError(backendMessage));
      throw err;
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
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marketing Campaign 2025"
              className="w-full text-black px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What is this project about?"
              className="w-full px-4 py-3 text-black rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
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
              disabled={loading || !name.trim()}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
