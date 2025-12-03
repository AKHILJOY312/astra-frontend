// src/presentation/pages/user/Dashboard.tsx
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { openCreateProjectModal } from "@/presentation/redux/slice/uiSlice";
import { useProjects } from "@/presentation/hooks/useProjects";

import CreateProjectModal from "@/presentation/components/user/common/CreateProjectModal";
import ProjectCard from "@/presentation/components/user/common/ProjectCard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { projects, loading } = useProjects();

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
      </div>

      <CreateProjectModal />
    </>
  );
}
