import {
  ChevronDown,
  Info,
  Calendar,
  Users,
  ClipboardCheck,
  Settings,
} from "lucide-react";
import { Dropdown } from "@/components/atoms/admin/dropdown/Dropdown";
import { DropdownItem } from "@/components/atoms/admin/dropdown/DropdownItem";

interface WorkspaceHeaderProps {
  projectName: string;
  initials: string;
  description: string;
  createdAt: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onViewMembers: () => void;
  onViewTasks: () => void;
  onEditProject: () => void;
}

export const WorkspaceHeader = ({
  projectName,
  initials,
  description,
  createdAt,
  isOpen,
  onToggle,
  onClose,
  onViewMembers,
  onViewTasks,
  onEditProject,
}: WorkspaceHeaderProps) => (
  <>
    <button
      onClick={onToggle}
      className="flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-1.5 transition w-full text-left"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
        {initials}
      </div>
      <span className="font-semibold text-white truncate flex-1">
        {projectName}
      </span>
      <ChevronDown
        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>

    <Dropdown isOpen={isOpen} onClose={onClose} align="left">
      <div className="w-60">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xl">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {projectName}
              </h3>
              <p className="text-xs text-gray-400">Workspace</p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <WorkspaceDetail
            icon={<Info className="w-4 h-4 text-gray-400 mt-0.5" />}
            label="Description"
            value={description}
          />
          <WorkspaceDetail
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
            label="Created"
            value={createdAt}
          />
        </div>
        <div className="border-t border-white/10 p-3 space-y-1">
          <DropdownItem
            icon={<Users className="w-4 h-4" />}
            onClick={onViewMembers}
          >
            View Members
          </DropdownItem>
          <DropdownItem
            icon={<ClipboardCheck className="w-4 h-4" />}
            onClick={onViewTasks}
          >
            View Tasks
          </DropdownItem>
          <DropdownItem
            icon={<Settings className="w-4 h-4" />}
            onClick={onEditProject}
          >
            Edit Project
          </DropdownItem>
        </div>
      </div>
    </Dropdown>
  </>
);

const WorkspaceDetail = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex gap-3">
    {icon}
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-white mt-1">{value}</p>
    </div>
  </div>
);
