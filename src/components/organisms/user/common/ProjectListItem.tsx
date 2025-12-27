// src/presentation/components/user/layout/ProjectListItem.tsx
import { ChevronRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { Project } from "@/types";

interface ProjectListItemProps {
  project: Project;
  isCollapsed: boolean;
}

export default function ProjectListItem({
  project,
  isCollapsed,
}: ProjectListItemProps) {
  const navigate = useNavigate();
  const currentProjectId = useSelector(
    (state: RootState) => state.project.currentProject?.id
  );

  const isActive = currentProjectId === project.id;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
        ${
          isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        }
      `}
    >
      {/* Project Icon / Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`
          w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg
          ${
            isActive
              ? "bg-white/20"
              : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
          }
        `}
        >
          {project.projectName[0].toUpperCase()}
        </div>
        {project?.imageUrl && (
          <Lock className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-900 text-white rounded-full p-0.5" />
        )}
      </div>

      {/* Expanded View */}
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium truncate ${
                isActive ? "text-white" : "text-gray-900 dark:text-white"
              }`}
            >
              {project.projectName}
            </h3>
            <p
              className={`text-xs truncate ${
                isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {project.description || "No description"}
            </p>
          </div>
          <ChevronRight
            className={`w-5 h-5 transition-transform ${
              isActive ? "translate-x-1" : ""
            }`}
          />
        </>
      )}
    </div>
  );
}
