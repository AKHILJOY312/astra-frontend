// src/presentation/pages/user/Dashboard.tsx
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { openCreateProjectModal } from "@/presentation/redux/slice/uiSlice";
import { useProjects } from "@/presentation/hooks/useProjects";

import CreateProjectModal from "@/presentation/components/user/common/CreateProjectModal";
import ProjectCard from "@/presentation/components/user/common/ProjectCard";
import Button from "@/presentation/components/admin/ui/button/Button";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { projects, loading, page, totalPages, loadProjects } = useProjects();
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <div className="flex-1 mt-5 ml-3 lg:ml-3 transition-all duration-300">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all your team workspaces in one place
            </p>
          </div>

          {/* Create Button */}
          <div className="mb-8">
            <button
              onClick={() => dispatch(openCreateProjectModal())}
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Create New Project
            </button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24">
              <div className="bg-gray-200 dark:bg-gray-800 border-2 border-dashed rounded-3xl w-32 h-32 mx-auto mb-8" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Get started by creating your first project
              </p>
              <button
                onClick={() => dispatch(openCreateProjectModal())}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium text-lg"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border dark:border-gray-800">
              <Button
                variant="primary"
                size="sm"
                disabled={page === 1}
                onClick={() => loadProjects({ page: page - 1 })}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => loadProjects({ page: p })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
            ${
              p === page
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
                >
                  {p}
                </button>
              ))}

              <Button
                variant="primary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => loadProjects({ page: page + 1 })}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateProjectModal />
    </>
  );
}
