// src/presentation/components/user/project/ProjectCard.tsx
// import { Users, MessageSquare, Lock, Globe } from "lucide-react";
import type { Project } from "@/types";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header Image or Gradient */}
      <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.projectName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-black/20" />
        )}
        {/* <div className="absolute top-4 right-4">
          {project?.isPrivate ? (
            <Lock className="w-5 h-5 text-white bg-black/50 rounded-full p-1" />
          ) : (
            <Globe className="w-5 h-5 text-white bg-black/50 rounded-full p-1" />
          )}
        </div> */}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {project.projectName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
          {project.description || "No description"}
        </p>

        {/* Footer Stats */}
        {/* <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>12 members</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>48 messages</span>
          </div>
        </div> */}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 ring-4 ring-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
    </div>
  );
}
