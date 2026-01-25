import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { useProjects } from "@/hooks/useProjects";
import { useChannels } from "@/hooks/useChannels";
import {
  openEditProjectModal,
  openInviteMemberModal,
  openViewMembersModal,
} from "@/redux/slice/uiSlice";
import { setActiveChannel } from "@/redux/slice/channelSlice";
import { setCurrentProject } from "@/redux/slice/projectSlice";

import { WorkspaceHeader } from "../../../molecules/user/channel/WorkspaceHeader";
import { ChannelItem } from "../../../atoms/user/Channel/ChannelItem";
import { CreateChannelModal } from "../Channel/CreateChannelModal";
import { EditChannelModal } from "../Channel/EditChannelModal";
import type { Channel } from "@/types";

export default function ChannelSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const { channels, loading, activeChannelId } = useChannels(projectId!);
  const { projects } = useProjects();

  const [channelsCollapsed, setChannelsCollapsed] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [channelToEdit, setChannelToEdit] = useState<Channel | null>(null);
  const [width, setWidth] = useState(240); // Initial width in pixels (w-60 is 240px)
  const isResizing = useRef(false);
  const currentProject = projects.find((p) => p.id === projectId);
  const projectName = currentProject?.projectName || "Loading...";

  const initials = projectName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const createdAt = currentProject?.createdAt
    ? new Date(currentProject.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  // Function to start resizing
  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "col-resize"; // Visual feedback
    document.body.style.userSelect = "none"; // Prevent text selection
  }, []);

  // Function to calculate new width
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    // Constraints: Min 160px, Max 480px
    const newWidth = Math.min(Math.max(e.clientX, 160), 280);
    setWidth(newWidth);
  }, []);

  // Cleanup listeners
  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, [handleMouseMove]);

  // Clean up on unmount just in case
  useEffect(() => {
    return () => stopResizing();
  }, [stopResizing]);
  return (
    <div
      className="bg-[#1A1D21] text-gray-300 flex flex-col h-screen  relative group/sidebar"
      style={{
        width: `${width}px`,
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        onMouseDown={startResizing}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#1264a3] transition-colors active:bg-[#1264a3] z-50"
      />
      <WorkspaceHeader
        projectName={projectName}
        initials={initials}
        description={currentProject?.description || "No description"}
        createdAt={createdAt}
        isOpen={isProjectMenuOpen}
        onToggle={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
        onClose={() => setIsProjectMenuOpen(false)}
        onViewMembers={() => {
          dispatch(openViewMembersModal());
          setIsProjectMenuOpen(false);
        }}
        onViewTasks={() => navigate(`/projects/${projectId}/task`)}
        onEditProject={() => {
          dispatch(setCurrentProject(currentProject!));
          dispatch(openEditProjectModal());
        }}
      />

      <button
        onClick={() => dispatch(openInviteMemberModal())}
        className="mx-2 mt-4 flex items-center gap-2 p-1.5 hover:bg-white/10 rounded transition text-sm"
      >
        <Plus className="w-4 h-4" /> Invite Members
      </button>

      <div className="flex-1 overflow-y-auto mt-4 px-2">
        <div
          className="flex items-center justify-between px-2 py-1 hover:bg-white/5 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
          onClick={() => setChannelsCollapsed(!channelsCollapsed)}
        >
          <span className="flex items-center gap-1">
            {channelsCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Channels
          </span>
          <Plus
            className="w-4 h-4 cursor-pointer hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsCreateModalOpen(true);
            }}
          />
        </div>

        {!channelsCollapsed && (
          <div className="mt-1 space-y-0.5">
            {loading ? (
              <p className="px-3 py-2 text-xs text-gray-500">Loading...</p>
            ) : channels.length === 0 ? (
              <p className="px-3 py-2 text-xs text-gray-500">
                No channels yet.
              </p>
            ) : (
              channels.map((ch) => (
                <ChannelItem
                  key={ch.id}
                  channel={ch}
                  isActive={activeChannelId === ch.id}
                  isManager={true}
                  onClick={(c) => dispatch(setActiveChannel(c))}
                  onEdit={(c) => {
                    setChannelToEdit(c);
                    setIsEditModalOpen(true);
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateChannelModal
          projectId={projectId!}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
      {isEditModalOpen && channelToEdit && (
        <EditChannelModal
          projectId={projectId!}
          channel={channelToEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
