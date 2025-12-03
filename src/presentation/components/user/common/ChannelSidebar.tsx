// src/components/slack/ChannelSidebar.tsx
import { useState } from "react";
import {
  Hash,
  Lock,
  Plus,
  ChevronDown,
  ChevronRight,
  Search,
  Settings,
  Circle,
  Info,
  Calendar,
  Users,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { openInviteMemberModal } from "@/presentation/redux/slice/uiSlice";
import { useProjects } from "@/presentation/hooks/useProjects";
import { useParams } from "react-router-dom";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";

export default function ChannelSidebar() {
  const [channelsCollapsed, setChannelsCollapsed] = useState(false);
  const [dmsCollapsed, setDmsCollapsed] = useState(false);
  const [activeChannel, setActiveChannel] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, loading } = useProjects();
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const currentProject = projects.find((p) => p.id === projectId);

  const projectName = currentProject?.projectName || "Loading...";
  const description = currentProject?.description || "No description";
  const createdAt = currentProject?.createdAt
    ? new Date(currentProject.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";
  const fallbackName = projectName.slice(0, 2).toUpperCase();

  // For initials in the top bar
  const initials = projectName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const channels = [
    { id: "1", name: "general", private: false, unread: true },
    { id: "2", name: "random", private: false },
    { id: "3", name: "design-system", private: false },
    { id: "4", name: "engineering", private: false, mentionCount: 5 },
    { id: "5", name: "private-vip", private: true },
    { id: "6", name: "offtopic", private: false },
    { id: "7", name: "announcements", private: false },
    { id: "8", name: "feedback", private: false },
  ];

  const dms = [
    { id: "d1", name: "Alice Johnson", online: true, unread: 2 },
    { id: "d2", name: "Bob Smith", online: false },
    { id: "d3", name: "Charlie Brown", online: true },
  ];

  return (
    <div className="w-60 bg-[#1A1D21] text-gray-300 flex flex-col h-screen min-h-0 pt-12">
      {/* Fixed Top Header */}
      <button
        onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
        className="dropdown-toggle flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-1.5 transition group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
          {initials}
        </div>
        <span className="font-semibold text-white truncate max-w-32">
          {projectName}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isProjectMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Reusable Dropdown */}
      <Dropdown
        isOpen={isProjectMenuOpen}
        onClose={() => setIsProjectMenuOpen(false)}
        align="left"
      >
        <div className="w-60">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center justify-center font-bold text-white text-xl">
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
            <div className="flex gap-3">
              <Info className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">
                  Description
                </p>
                <p className="text-white mt-1">{description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">
                  Created
                </p>
                <p className="text-white">{createdAt}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-3 space-y-1">
            <DropdownItem
              icon={<Users className="w-4 h-4" />}
              onClick={() => {
                dispatch(openInviteMemberModal());
                setIsProjectMenuOpen(false);
              }}
            >
              View Members
            </DropdownItem>
            <DropdownItem icon={<Settings className="w-4 h-4" />}>
              Project Settings
            </DropdownItem>
          </div>
        </div>
      </Dropdown>

      <button
        onClick={() => dispatch(openInviteMemberModal())}
        className="p-1.5 hover:bg-white/10 rounded transition"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Scrollable Middle Area - THIS IS THE KEY FIX */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {" "}
        {/* min-h-0 is crucial! */}
        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Jump to..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-1.5 bg-[#2D2F33] rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
        </div>
        {/* Channels */}
        <div className="px-2">
          <button
            onClick={() => setChannelsCollapsed(!channelsCollapsed)}
            className="w-full flex items-center justify-between px-2 py-1 hover:bg-white/5 rounded text-xs font-semibold uppercase tracking-wider"
          >
            <span className="flex items-center gap-1">
              {channelsCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Channels
            </span>
            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </button>

          {!channelsCollapsed && (
            <div className="mt-1 space-y-0.5">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 transition-all group text-left ${
                    activeChannel === ch.id
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-gray-100"
                  }`}
                >
                  {ch.private ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Hash className="w-4 h-4" />
                  )}
                  <span className="truncate text-sm">{ch.name}</span>
                  {ch.mentionCount && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      {ch.mentionCount}
                    </span>
                  )}
                  {ch.unread && !ch.mentionCount && activeChannel !== ch.id && (
                    <Circle className="w-1.5 h-1.5 ml-auto fill-white" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Direct Messages */}
        <div className="px-2 mt-6">
          <button
            onClick={() => setDmsCollapsed(!dmsCollapsed)}
            className="w-full flex items-center justify-between px-2 py-1 hover:bg-white/5 rounded text-xs font-semibold uppercase tracking-wider"
          >
            <span className="flex items-center gap-1">
              {dmsCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Direct Messages
            </span>
          </button>

          {!dmsCollapsed && (
            <div className="mt-1 space-y-0.5">
              {dms.map((dm) => (
                <button
                  key={dm.id}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 transition-all group text-left"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-medium">
                      {dm.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {dm.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1A1D21] rounded-full" />
                    )}
                  </div>
                  <span className="truncate text-sm">{dm.name}</span>
                  {dm.unread && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {dm.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Extra space at bottom so last item isn't glued to user bar */}
        <div className="h-4" />
      </div>

      {/* Fixed Bottom User Bar - Always Visible */}
      <div className="border-t border-white/10 p-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1A1D21] rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
