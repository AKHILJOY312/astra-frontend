// src/presentation/components/user/modals/InviteMemberModal.tsx
import { X, Loader2, Mail, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeInviteMemberModal } from "@/presentation/redux/slice/uiSlice";
import type { RootState } from "@/presentation/redux/store/store";
import { useState } from "react";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { AddMemberUseCase } from "@/application/use-cases/project/AddMemberUseCase";

const addMemberUC = container.get<AddMemberUseCase>(TYPES.AddMemberUseCase);

export default function InviteMemberModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.inviteMemberModal);
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "lead" | "manager">("member");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(currentProject);
    if (!currentProject || !email.trim()) return;

    setLoading(true);
    setError("");
    try {
      await addMemberUC.execute({
        projectId: currentProject.id,
        userEmail: email.trim(),
        role,
      });
      setSuccess(true);
      setTimeout(() => {
        dispatch(closeInviteMemberModal());
        setEmail("");
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send invite";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-black bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invite Team Member
          </h2>
          <button
            onClick={() => dispatch(closeInviteMemberModal())}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleInvite} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="member">Member</option>
              <option value="lead">Lead</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invitation sent successfully!
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
