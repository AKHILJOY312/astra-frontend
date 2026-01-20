import { useEffect, useState } from "react";
import type { AssignableMember, TaskPriority } from "@/types";
import type { CreateTaskRequest } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useTasks } from "@/hooks/useTasks";

interface CreateTaskModalProps {
    projectId: string;
    onClose: () => void;
    onCreate: (data: CreateTaskRequest) => void;
}

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export default function CreateTaskModal({
    projectId,
    onClose,
    onCreate,
}: CreateTaskModalProps) {
    const [form, setForm] = useState<CreateTaskRequest>({
        projectId,
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
    });
    const [assigneeQuery, setAssigneeQuery] = useState("");;
    const [members, setMembers] = useState<AssignableMember[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const debouncedQuery = useDebounce(assigneeQuery, 500);

    const { searchMembers } = useTasks(projectId)


    useEffect(() => {
        if (!debouncedQuery.trim()) { setMembers([]); return };
        let active = true;
        const loadMembers = async () => {
            setLoadingMembers(true);
            try {
                const res = await searchMembers({
                    projectId,
                    query: debouncedQuery,
                })
                if (active) {
                    setMembers(res.members);
                }
            } finally {
                setLoadingMembers(false);
            }

        }
        loadMembers();
        return () => {
            active = false;
        }

    }, [debouncedQuery, projectId, searchMembers])

    const submit = () => {
        if (!form.title.trim()) return;
        if (!form.assignedTo.trim()) return;

        onCreate({
            ...form,
            description: form.description || undefined,
            dueDate: form.dueDate || undefined,
            attachments: undefined, // added later cleanly
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#232529]">
                <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold">Create Task</h3>

                    {/* Title */}
                    <div>
                        <label className="text-sm text-gray-300">Title *</label>
                        <input
                            className="mt-1 w-full rounded-lg border border-gray-800 bg-[#1a1d21] p-2 text-white"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-gray-300">Description</label>
                        <textarea
                            className="mt-1 w-full rounded-lg border border-gray-800 bg-[#1a1d21] p-2 text-white"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    {/* Assigned To (User ID for now) */}
                    <div>

                        <label className="text-sm text-gray-300">Assign To *</label>
                        <input
                            className="mt-1 w-full rounded-lg border border-gray-800 bg-[#1a1d21] p-2 text-white"
                            placeholder="Search by name or email"
                            value={assigneeQuery}
                            onChange={(e) => setAssigneeQuery(e.target.value)}
                        />
                        {(loadingMembers || members.length > 0) && (
                            <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-800 bg-[#1a1d21]">
                                {loadingMembers && (
                                    <div className="p-2 text-sm text-gray-400">Searching...</div>
                                )}

                                {!loadingMembers &&
                                    members.map((user) => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => {
                                                setForm({ ...form, assignedTo: user.id });
                                                setAssigneeQuery(user.name || user.email);
                                                setMembers([]);
                                            }}
                                            className="flex w-full items-center gap-2 p-2 hover:bg-[#232529]"
                                        >
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    className="h-6 w-6 rounded-full"
                                                />
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                                                    {user.name?.[0] || "?"}
                                                </div>
                                            )}

                                            <div className="text-left">
                                                <div className="text-sm text-white">{user.name}</div>
                                                <div className="text-xs text-gray-400">{user.email}</div>
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        )}

                    </div>


                    {/* Priority */}
                    <div>
                        <label className="text-sm text-gray-300">Priority</label>
                        <select
                            className="mt-1 w-full rounded-lg border border-gray-800 bg-[#1a1d21] p-2 text-white"
                            value={form.priority}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    priority: e.target.value as TaskPriority,
                                })
                            }
                        >
                            {PRIORITIES.map((p) => (
                                <option key={p} value={p}>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="text-sm text-gray-300">Due Date</label>
                        <input
                            type="datetime-local"
                            className="mt-1 w-full rounded-lg border border-gray-800 bg-[#1a1d21] p-2 text-white"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    dueDate: e.target.value
                                        ? new Date(e.target.value).toISOString()
                                        : undefined,
                                })
                            }
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-gray-800 px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submit}
                            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
