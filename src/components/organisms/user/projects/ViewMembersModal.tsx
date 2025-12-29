import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeViewMembersModal } from "@/redux/slice/uiSlice";
import { useProjects } from "@/hooks/useProjects";
import { useUi } from "@/hooks/useUi";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";
export type Member = {
  id: string;
  role: Role;
  joinedAt?: string;
  user: {
    id?: string;
    name: string;
    email: string;
  };
};
export default function ViewMembersModal({ projectId }: { projectId: string }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const {
    loadProjectMembers,
    changeMemberRole,
    removeMember,
    members,
    membersLoading,
  } = useProjects();
  const { viewMembersModalOpen } = useUi();

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [newRole, setNewRole] = useState<Role | "">("");

  const currentUserMembership = members.find(
    (m) => m.user.email === user?.email
  );
  const isManager = currentUserMembership?.role === "manager";

  useEffect(() => {
    if (viewMembersModalOpen && projectId) {
      loadProjectMembers(projectId);
    }
  }, [viewMembersModalOpen, projectId, loadProjectMembers]);

  const openChangeRoleModal = (member: Member) => {
    setSelectedMember(member);
    setNewRole(member.role); // pre-fill current role
    setChangeRoleOpen(true);
  };

  const openRemoveMemberModal = (member: Member) => {
    setSelectedMember(member);
    setConfirmName("");
    setRemoveOpen(true);
  };

  const handleChangeRole = async () => {
    if (!selectedMember || !newRole || newRole === selectedMember.role) {
      setChangeRoleOpen(false);
      return;
    }

    try {
      await changeMemberRole(projectId, selectedMember.id, newRole);
      await loadProjectMembers(projectId); // refresh list
    } catch (error) {
      console.error("Failed to change role:", error);
      // Optionally show error toast
    } finally {
      setChangeRoleOpen(false);
      setSelectedMember(null);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      await removeMember(projectId, selectedMember.id);
      await loadProjectMembers(projectId);
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setRemoveOpen(false);
      setSelectedMember(null);
      setConfirmName("");
    }
  };

  if (!viewMembersModalOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#1A1D21] w-[420px] rounded-xl shadow-xl text-white">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Project Members</h2>
            <button
              onClick={() => dispatch(closeViewMembersModal())}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4 max-h-[420px] overflow-y-auto">
            {membersLoading ? (
              <p className="text-gray-400 text-sm text-center py-8">
                Loading members…
              </p>
            ) : members.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No members found.
              </p>
            ) : (
              members.map((m) => {
                const isSelf = m.user.email === user?.email;

                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition"
                  >
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {m.user.name}
                        {isSelf && (
                          <span className="text-xs text-gray-400">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">{m.user.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Role Badge */}
                      <span
                        className={`text-xs px-2 py-1 rounded-full capitalize ${
                          m.role === "manager"
                            ? "bg-red-500/20 text-red-400"
                            : m.role === "lead"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {m.role}
                      </span>

                      {/* Actions - only for managers and not self */}
                      {isManager && !isSelf && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openChangeRoleModal(m)}
                            className="text-xs px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                          >
                            Change Role
                          </button>
                          <button
                            onClick={() => openRemoveMemberModal(m)}
                            className="text-xs px-2 py-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Change Role Modal */}
      {changeRoleOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center">
          <div className="bg-[#1A1D21] w-[360px] rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">
              Change Role – {selectedMember.user.name}
            </h3>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as Role)}
              className="w-full bg-[#111] border border-white/10 rounded-md p-2 mb-6 text-white"
            >
              <option value="member">Member</option>
              <option value="lead">Lead</option>
              <option value="manager">Manager</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setChangeRoleOpen(false);
                  setSelectedMember(null);
                }}
                className="text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                disabled={newRole === selectedMember.role}
                className="text-sm px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Modal */}
      {removeOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center">
          <div className="bg-[#1A1D21] w-[380px] rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2 text-red-400">
              Remove Member
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to remove{" "}
              <strong>{selectedMember.user.name}</strong>? Type their name to
              confirm.
            </p>

            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Enter user name"
              className="w-full bg-[#111] border border-white/10 rounded-md p-2 mb-6 text-white placeholder-gray-500"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setRemoveOpen(false);
                  setSelectedMember(null);
                  setConfirmName("");
                }}
                className="text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={confirmName !== selectedMember.user.name}
                onClick={handleRemoveMember}
                className="text-sm px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
