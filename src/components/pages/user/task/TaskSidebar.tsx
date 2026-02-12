import type { ProjectGroup } from "@/types/myTasks.types";
import { Folder } from "lucide-react";

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
