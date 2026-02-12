import React from "react";
import { AlertCircle, Search } from "lucide-react";
import { getAllTaskForUser } from "@/services/task.service";
import { groupTasksByStatus } from "@/utils/utils";
import type { ProjectGroup } from "@/types/myTasks.types";
import { Link } from "react-router-dom";
import { TaskSidebar } from "./TaskSidebar";
import { ProjectHero } from "./ProjectHero";
import { TaskSection } from "./TaskSection";

export default function TasksPage() {
  const [projects, setProjects] = React.useState<ProjectGroup[]>([]);
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [showOverdueOnly, setShowOverdueOnly] = React.useState(false);

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

  // Logic to filter tasks based on overdue status
  const filteredTasks = React.useMemo(() => {
    if (!currentProject) return [];
    if (!showOverdueOnly) return currentProject.tasks;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate "One day before" (Tomorrow)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return currentProject.tasks.filter((task) => {
      if (!task.dueDate || task.status === "done") return false;

      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);

      // Condition 1: Passed the due date (Overdue)
      const isOverdue = taskDate < today;

      // Condition 2: Due today or tomorrow (Due Soon)
      const isDueSoon =
        taskDate.getTime() === today.getTime() ||
        taskDate.getTime() === tomorrow.getTime();

      return isOverdue || isDueSoon;
    });
  }, [currentProject, showOverdueOnly]);

  const groupedTasks = React.useMemo(() => {
    return groupTasksByStatus(filteredTasks);
  }, [filteredTasks]);

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

          {/* --- Overdue Toggle Button --- */}
          <button
            onClick={() => setShowOverdueOnly(!showOverdueOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              showOverdueOnly
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                : "bg-gray-800 text-gray-400 border border-transparent hover:border-gray-700"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {showOverdueOnly ? "Urgent & Overdue View" : "Show Urgent"}
          </button>
          <Link
            to={`/projects/${currentProject?.projectId}/task`}
            className="relative block w-full"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </Link>
        </header>
        {currentProject?.stats && !showOverdueOnly && (
          <ProjectHero
            stats={currentProject.stats}
            title={currentProject.projectTitle}
          />
        )}
        {/* Task Content */}

        {/* Task Content */}
        <div className="flex flex-col gap-2">
          <TaskSection
            title={showOverdueOnly ? "Overdue / Due Soon: To Do" : "To Do"}
            status="todo"
            tasks={groupedTasks["todo"] || []}
          />

          <TaskSection
            title={
              showOverdueOnly
                ? "Overdue / Due Soon: In Progress"
                : "In Progress"
            }
            status="inprogress"
            tasks={groupedTasks["inprogress"] || []}
          />

          {/* Hide Completed section when filtering for overdue/due soon */}
          {!showOverdueOnly && (
            <TaskSection
              title="Completed"
              status="done"
              tasks={groupedTasks["done"] || []}
            />
          )}
        </div>
        {filteredTasks.length === 0 && (
          <div className="text-center py-20 text-gray-600 italic border-2 border-dashed border-gray-800 rounded-3xl">
            {showOverdueOnly
              ? "No overdue tasks found!"
              : "No tasks found in this project."}
          </div>
        )}
        {/* {currentProject?.tasks.length === 0 && (
          <div className="text-center py-20 text-gray-600 italic border-2 border-dashed border-gray-800 rounded-3xl">
            No tasks found in this project.
          </div>
        )} */}
      </main>
    </div>
  );
}
