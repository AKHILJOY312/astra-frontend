import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeViewMembersModal } from "@/presentation/redux/slice/uiSlice";
import { useProjects } from "@/presentation/hooks/useProjects";
import { useUi } from "@/presentation/hooks/useUi";

export default function ViewMembersModal({ projectId }: { projectId: string }) {
  const dispatch = useDispatch();
  const { loadProjectMembers, members, membersLoading } = useProjects();
  const { viewMembersModalOpen } = useUi();

  useEffect(() => {
    if (viewMembersModalOpen && projectId) {
      loadProjectMembers(projectId);
    }
  }, [viewMembersModalOpen, projectId, loadProjectMembers]);

  if (!viewMembersModalOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1A1D21] w-[420px] rounded-xl shadow-xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between">
          <h2 className="text-lg font-semibold">Project Members</h2>
          <button
            onClick={() => dispatch(closeViewMembersModal())}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[420px] overflow-y-auto">
          {membersLoading ? (
            <p className="text-gray-400 text-sm">Loading members…</p>
          ) : members.length === 0 ? (
            <p className="text-gray-400 text-sm">No members found.</p>
          ) : (
            members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5"
              >
                <div>
                  <p className="font-medium">{m.user.name}</p>
                  <p className="text-xs text-gray-400">{m.user.email}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize
                    ${
                      m.role === "manager"
                        ? "bg-red-500/20 text-red-400"
                        : m.role === "lead"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                >
                  {m.role}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
