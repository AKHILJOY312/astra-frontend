import React from "react";
import { ProjectHero, TaskSection, TaskSidebar } from "./TaskComponent";

import { Search } from "lucide-react";
import { getAllTaskForUser } from "@/services/task.service";
import { groupTasksByStatus } from "@/utils/utils";
import type { ProjectGroup } from "@/types/myTasks.types";
import { Link } from "react-router-dom";

export default function TasksPage() {
  const [projects, setProjects] = React.useState<ProjectGroup[]>([]);
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getAllProjectTasks = async () => {
      try {
        const response = await getAllTaskForUser();
        const projectsData = response.data.data.projects || [];

        setProjects(projectsData);

        if (projectsData.length > 0) {
          setActiveProjectId((prev) => prev ?? projectsData[0].projectId);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    getAllProjectTasks();
  }, []);

  const currentProject = projects.find((p) => p.projectId === activeProjectId);
  const groupedTasks = currentProject
    ? groupTasksByStatus(currentProject.tasks)
    : {};

  if (loading)
    return (
      <div className="h-screen bg-[#1a1d21] flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (projects.length === 0) {
    return (
      <div className="h-screen bg-[#1a1d21] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">No projects found</h2>
          <p className="text-gray-400">
            Get started by creating your first project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#1a1d21] overflow-hidden">
      <TaskSidebar
        projects={projects}
        activeId={activeProjectId}
        onSelect={setActiveProjectId}
      />

      <main className="flex-1 flex  flex-col bg-[#1a1d21] h-screen overflow-y-auto p-8">
        {/* Modern Header Component */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#1a1d21]/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">
              {currentProject?.projectTitle}
            </h2>
            <div className="h-4 w-px bg-gray-700" />
          </div>
          <Link
            to={`/projects/${currentProject?.projectId}/task`}
            className="relative block w-full"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </Link>
        </header>
        {currentProject?.stats && (
          <ProjectHero
            stats={currentProject.stats}
            title={currentProject.projectTitle}
          />
        )}
        {/* Task Content */}

        {/* Render Groups Dynamically */}
        <TaskSection
          title="To Do"
          status="todo"
          tasks={groupedTasks["todo"] || []}
        />
        <TaskSection
          title="In Progress"
          status="inprogress"
          tasks={groupedTasks["inprogress"] || []}
        />
        <TaskSection
          title="Completed"
          status="done"
          tasks={groupedTasks["done"] || []}
        />

        {currentProject?.tasks.length === 0 && (
          <div className="text-center py-20 text-gray-600 italic border-2 border-dashed border-gray-800 rounded-3xl">
            No tasks found in this project.
          </div>
        )}
      </main>
    </div>
  );
}
