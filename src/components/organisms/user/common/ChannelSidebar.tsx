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
  Info,
  Calendar,
  Users,
} from "lucide-react";

import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { useProjects } from "@/hooks/useProjects";
import { useChannels } from "@/hooks/useChannels";
import {
  openEditProjectModal,
  openInviteMemberModal,
  openViewMembersModal,
} from "@/redux/slice/uiSlice";

import { Dropdown } from "@/components/atoms/dropdown/Dropdown";
import { DropdownItem } from "@/components/atoms/dropdown/DropdownItem";

import { setActiveChannel } from "@/redux/slice/channelSlice";
import { setCurrentProject } from "@/redux/slice/projectSlice";
import type { Channel } from "@/types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function ChannelSidebar() {
  const dispatch = useDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const { channels, loading, activeChannelId } = useChannels(projectId!);
  const { projects } = useProjects();
  const [channelsCollapsed, setChannelsCollapsed] = useState(false);
  const [dmsCollapsed, setDmsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const currentProject = projects.find((p) => p.id === projectId);
  const projectName = currentProject?.projectName || "Loading...";
  const description = currentProject?.description || "No description";
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [channelToEdit, setChannelToEdit] = useState<Channel | null>(null);
  const createdAt = currentProject?.createdAt
    ? new Date(currentProject.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const initials = projectName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const dms = [
    { id: "d1", name: "Alice Johnson", online: true, unread: 2 },
    { id: "d2", name: "Bob Smith", online: false },
    { id: "d3", name: "Charlie Brown", online: true },
  ];
  const handleEditChannel = (channel: Channel) => {
    setChannelToEdit(channel);
    setIsEditModalOpen(true);
  };
  const handleChannelClick = (channel: Channel) => {
    dispatch(setActiveChannel(channel));
  };

  const isCurrentUserManager = true; // Replace with actual permission check
  return (
    <div className="w-60 bg-[#1A1D21] text-gray-300 flex flex-col h-screen min-h-0 pt-12">
      {/* ───────────────────────────────────
          HEADER (Workspace info)
      ─────────────────────────────────── */}
      <button
        onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
        className="dropdown-toggle flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-1.5 transition group"
      >
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
          {initials}
        </div>
        <span className="font-semibold text-white truncate max-w-32">
          {projectName}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isProjectMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Workspace Dropdown */}
      <Dropdown
        isOpen={isProjectMenuOpen}
        onClose={() => setIsProjectMenuOpen(false)}
        align="left"
      >
        <div className="w-60">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xl">
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
                dispatch(openViewMembersModal());
                setIsProjectMenuOpen(false);
              }}
            >
              View Members
            </DropdownItem>

            <DropdownItem
              icon={<Settings className="w-4 h-4" />}
              onClick={() => {
                dispatch(setCurrentProject(currentProject!));
                dispatch(openEditProjectModal());
              }}
            >
              Edit Project
            </DropdownItem>
          </div>
        </div>
      </Dropdown>

      {/* Add channel button */}
      <button
        onClick={() => dispatch(openInviteMemberModal())}
        className="p-1.5 hover:bg-white/10 rounded transition"
      >
        <Plus className="w-4 h-4" /> Invite Members
      </button>

      {/* ───────────────────────────────────
          MAIN SCROLL AREA
      ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
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

        {/* ───────────────────────────────────
            CHANNEL LIST (REAL DATA)
        ─────────────────────────────────── */}
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
              {/* ← Fixed: No longer a <button> inside <button> */}
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering parent button
                  setOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    setOpen(true);
                  }
                }}
                className="p-1.5 hover:bg-white/10 rounded-md transition cursor-pointer inline-flex items-center justify-center"
                title="Create Channel"
                aria-label="Create new channel"
              >
                <Plus className="w-4 h-4" />
              </div>
            </span>
          </button>
          {!channelsCollapsed && (
            <div className="mt-1 space-y-0.5">
              {/* Loading state */}
              {loading ? (
                <p className="px-3 py-2 text-xs text-gray-500">
                  Loading channels...
                </p>
              ) : channels.length === 0 ? (
                <p className="px-3 py-2 text-xs text-gray-500">
                  No channels yet.
                </p>
              ) : (
                channels.map((ch) => (
                  <div
                    key={ch.id}
                    className="relative group" // ← Important: wrapper for hover
                  >
                    <button
                      onClick={() => handleChannelClick(ch)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all
              ${
                activeChannelId === ch.id
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
                    >
                      {/* Channel icon */}
                      {ch.unreadCount ? (
                        <Lock className="w-4 h-4 shrink-0" />
                      ) : (
                        <Hash className="w-4 h-4 shrink-0" />
                      )}

                      {/* Channel name */}
                      <span className="truncate text-sm flex-1">
                        {ch.channelName}
                      </span>

                      {/* Unread indicator (optional) */}
                      {/* {ch.unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {ch.unreadCount}
                        </span>
                      )} */}
                    </button>

                    {/* Edit button — only for managers */}
                    {isCurrentUserManager && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditChannel(ch);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 
                p-1.5 rounded-md opacity-0 group-hover:opacity-100 
                hover:bg-white/20 transition-all"
                        title="Edit channel"
                      >
                        <Settings className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/* DMS */}
        <div className="px-2 mt-6">
          <button
            onClick={() => setDmsCollapsed(!dmsCollapsed)}
            className="w-full flex items-center justify-between px-2 py-1 hover:bg-white/5 rounded text-xs font-semibold uppercase"
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

          {!dmsCollapsed &&
            dms.map((dm) => (
              <button
                key={dm.id}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 transition"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-medium">
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
        {/* Extra padding */}
        {/* Modal */}
        {open && (
          <CreateChannelModal
            projectId={projectId!}
            onClose={() => setOpen(false)}
          />
        )}
        {/* ADD Modal for Editing Channels */}
        {isEditModalOpen && channelToEdit && (
          <EditChannelModal
            projectId={projectId!}
            channel={channelToEdit}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
        <div className="h-4" />
      </div>

      {/* ───────────────────────────────────
          BOTTOM USER BAR
      ─────────────────────────────────── */}
      {/* <div className="border-t border-white/10 p-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
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
      </div> */}
    </div>
  );
}

type Role = "manager" | "lead" | "member";
type Permission = "manager" | "view" | "message";

const roles: Role[] = ["manager", "lead", "member"];
type CreateChannelModalProps = {
  onClose: () => void;
  projectId: string;
};
function CreateChannelModal({ projectId, onClose }: CreateChannelModalProps) {
  const { createChannel } = useChannels(projectId);
  const [error, setError] = useState<string | null>(null);

  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [visibleToRoles, setVisibleToRoles] = useState<Role[]>(roles);
  const [permissionsByRole, setPermissionsByRole] = useState<
    Record<Role, Permission>
  >(
    Object.fromEntries(roles.map((r) => [r, "view"])) as Record<
      Role,
      Permission
    >
  );

  const handleSubmit = async () => {
    setError(null);

    try {
      await createChannel({
        channelName,
        description,
        visibleToRoles,
        permissionsByRole,
      });

      onClose(); // only close on success
    } catch (error: unknown) {
      const err = error as ApiError;
      console.log("Create channel error:", err);

      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-black p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Create Channel</h3>

        <input
          type="text"
          placeholder="Channel name"
          className="border p-2 rounded w-full mb-3"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />

        <textarea
          placeholder="Description (optional)"
          className="border p-2 rounded w-full mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Visible Roles */}
        <p className="font-medium mb-1">Visible to roles:</p>
        <div className="flex gap-3 mb-4">
          {roles.map((r) => (
            <label key={r} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={visibleToRoles.includes(r)}
                onChange={() => {
                  if (visibleToRoles.includes(r)) {
                    setVisibleToRoles(visibleToRoles.filter((x) => x !== r));
                  } else {
                    setVisibleToRoles([...visibleToRoles, r]);
                  }
                }}
              />
              {r}
            </label>
          ))}
        </div>

        {/* Permissions */}
        <p className="font-medium mb-1">Permissions:</p>
        {roles.map((r) => (
          <div key={r} className="flex items-center justify-between mb-2">
            <span>{r}</span>
            <select
              className="border p-1 rounded"
              value={permissionsByRole[r]}
              onChange={(e) =>
                setPermissionsByRole({
                  ...permissionsByRole,
                  [r]: e.target.value as Permission,
                })
              }
            >
              <option value="view">View</option>
              <option value="message">Message</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        ))}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 text-black bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

type EditChannelModalProps = {
  onClose: () => void;
  channel: Channel; // ← Now correct
  projectId: string;
};
function EditChannelModal({
  projectId,
  channel,
  onClose,
}: EditChannelModalProps) {
  const { editChannel } = useChannels(projectId);

  const [channelName, setChannelName] = useState(channel.channelName);
  const [description, setDescription] = useState(channel.description || "");
  const [error, setError] = useState<string | null>(null);

  // Initialize from actual channel data
  const [visibleToRoles, setVisibleToRoles] = useState<Role[]>(roles);
  const [permissionsByRole, setPermissionsByRole] = useState<
    Record<Role, Permission>
  >(channel.permissionsByRole);

  const handleSubmit = async () => {
    try {
      await editChannel(channel.id, {
        channelName: channelName.trim() || undefined,
        description: description.trim() || undefined,
        visibleToRoles: visibleToRoles.length > 0 ? visibleToRoles : undefined,
        permissionsByRole:
          Object.keys(permissionsByRole).length > 0
            ? permissionsByRole
            : undefined,
      });

      onClose();
    } catch (error: unknown) {
      const err = error as ApiError;
      setError(err.response?.data?.message || "Could not update channel");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#2D2F33] p-6 rounded-lg w-96 text-white shadow-2xl">
        <h3 className="text-2xl font-bold mb-6">Edit Channel</h3>

        <input
          type="text"
          placeholder="Channel name"
          className="w-full px-4 py-3 bg-[#1A1D21] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />

        <textarea
          placeholder="Description (optional)"
          className="w-full px-4 py-3 bg-[#1A1D21] rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Visible to Roles */}
        <p className="font-medium mb-3">Visible to:</p>
        <div className="flex gap-6 mb-6">
          {roles.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleToRoles.includes(r)}
                onChange={() => {
                  setVisibleToRoles((prev) =>
                    prev.includes(r)
                      ? prev.filter((x) => x !== r)
                      : [...prev, r]
                  );
                }}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <span className="capitalize">{r}</span>
            </label>
          ))}
        </div>

        {/* Permissions */}
        <p className="font-medium mb-3">Permissions:</p>
        <div className="space-y-3">
          {roles.map((r) => (
            <div key={r} className="flex items-center justify-between">
              <span className="capitalize">{r}</span>
              <select
                value={permissionsByRole[r]}
                onChange={(e) =>
                  setPermissionsByRole({
                    ...permissionsByRole,
                    [r]: e.target.value as Permission,
                  })
                }
                className="bg-[#1A1D21] px-3 py-2 rounded text-sm"
              >
                <option value="view">Can View</option>
                <option value="message">Can Message</option>
                <option value="manager">Can Manage</option>
              </select>
            </div>
          ))}
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!channelName.trim()}
            className="px-5 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-lg transition font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
