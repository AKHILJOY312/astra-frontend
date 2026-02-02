import type { MyTasks, ProjectGroup } from "@/types/myTasks.types";
import { Folder, Calendar, Paperclip, MoreVertical } from "lucide-react";

// --- Status Badge Component ---
export const TaskStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    done: "bg-green-500/10 text-green-500 border-green-500/20",
    inprogress: "bg-purple-500/10 text-purple-500 border-purple-400/20",
    todo: "bg-gray-800 text-gray-400 border-gray-700",
  };
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-tighter ${styles[status] || styles.todo}`}
    >
      {status}
    </span>
  );
};

// --- Individual Task Row Component ---
export const TaskRow = ({ task }: { task: MyTasks }) => (
  <div className="group flex items-center px-4 py-3 rounded-xl border border-transparent hover:border-gray-800 hover:bg-[#232529]/50 transition-all cursor-pointer min-w-0">
    <div className="w-8">
      <div
        className={`w-5 h-5 rounded-full border-2 border-gray-700 flex items-center justify-center group-hover:border-purple-500 transition-colors ${task.status === "done" ? "bg-green-500/20 border-green-500" : ""}`}
      >
        {task.status === "done" && (
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        )}
      </div>
    </div>
    <div className="flex-1 min-w-0 pr-4">
      <div className="flex items-center gap-2">
        <span
          className={`font-semibold truncate ${task.status === "done" ? "text-gray-500 line-through" : "text-white"}`}
        >
          {task.title}
        </span>
        {task.hasAttachments && <Paperclip className="w-3 h-3 text-gray-600" />}
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-1 max-w-[400px] group-hover:text-gray-400 transition-colors">
          {task.description}
        </p>
      )}
    </div>
    <div className="w-32">
      <TaskStatusBadge status={task.status} />
    </div>
    <div className="w-32 flex items-center gap-2 text-xs text-gray-400">
      <Calendar className="w-3 h-3" />
      <span>
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })
          : "—"}
      </span>
    </div>
    <div className="w-24 text-xs font-medium uppercase tracking-widest text-gray-400">
      {task.priority}
    </div>
    <div className="w-8 opacity-0 group-hover:opacity-100 transition-opacity">
      <MoreVertical className="w-4 h-4 text-gray-500" />
    </div>
  </div>
);

// --- Sidebar Component ---
export const TaskSidebar = ({
  projects,
  activeId,
  onSelect,
}: {
  projects: ProjectGroup[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) => (
  <aside className="w-64 border-r border-gray-800 bg-[#1a1d21] flex flex-col">
    <div className="p-6 border-b border-gray-800 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white">
        T
      </div>
      <span className="font-bold tracking-tight text-lg text-white">
        TaskFlow
      </span>
    </div>
    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
        Projects
      </div>
      {projects.map((p) => (
        <button
          key={p.projectId}
          onClick={() => onSelect(p.projectId)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group ${activeId === p.projectId ? "bg-[#232529] text-white shadow-lg" : "text-gray-400 hover:bg-[#232529]/50 hover:text-gray-200"}`}
        >
          <div className="flex items-center gap-3">
            <Folder
              className={`w-4 h-4 ${activeId === p.projectId ? "text-purple-500" : ""}`}
            />
            <span className="text-sm font-medium truncate w-32 text-left">
              {p.projectTitle}
            </span>
          </div>
          <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">
            {p.tasks.length}
          </span>
        </button>
      ))}
    </nav>
  </aside>
);
interface ProjectStats {
  total: number;
  todo: number;
  inprogress: number;
  done: number;
  completionPercentage: number;
}
export const ProjectHero = ({
  stats,
}: {
  stats: ProjectStats;
  title: string;
}) => {
  // SVG Circle Logic
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (stats.completionPercentage / 100) * circumference;

  return (
    <div className="mb-8 p-6 rounded-3xl bg-linear-to-br from-[#232529] to-[#1a1d21] border border-gray-800 shadow-2xl pb-10">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Progress Chart */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-800"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-purple-500 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-white">
              {stats.completionPercentage}%
            </span>
            <span className="text-[10px] text-gray-500 uppercase font-bold">
              Done
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {[
            {
              label: "Total Tasks",
              value: stats.total,
              color: "text-blue-400",
            },
            { label: "To Do", value: stats.todo, color: "text-gray-400" },
            {
              label: "In Progress",
              value: stats.inprogress,
              color: "text-purple-400",
            },
            { label: "Completed", value: stats.done, color: "text-green-400" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-[#1a1d21]/50 border border-gray-800/50"
            >
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                {item.label}
              </p>
              <p className={`text-2xl font-mono font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TaskSection = ({
  title,
  tasks,
  status,
}: {
  title: string;
  tasks: MyTasks[];
  status: string;
}) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Sticky Header with Counter */}
      <div className="flex items-center gap-3 py-2 px-2 sticky top-0 bg-[#1a1d21] z-10 border-b border-gray-800/50 mb-3">
        <div
          className={`w-2 h-2 rounded-full ${
            status === "done"
              ? "bg-green-500"
              : status === "inprogress"
                ? "bg-purple-500"
                : "bg-gray-500"
          }`}
        />
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {title}
        </h3>
        <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-mono">
          {tasks.length}
        </span>
      </div>

      {/* Task Rows */}
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
