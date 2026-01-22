import { useState, useEffect } from "react";
import { User, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTasks } from "@/hooks/useTasks";
import type { AssignableMember } from "@/types";

interface AssigneeSelectProps {
  projectId: string;
  selectedId: string;
  onSelect: (id: string, name: string) => void;
  disabled?: boolean;
}

export function AssigneeSelect({
  projectId,
  selectedId,
  onSelect,
  disabled,
}: AssigneeSelectProps) {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<AssignableMember[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const { searchMembers } = useTasks(projectId);

  useEffect(() => {
    if (!debouncedQuery.trim() || selectedId) {
      setMembers([]);
      return;
    }
    let active = true;
    const loadMembers = async () => {
      setLoading(true);
      try {
        const res = await searchMembers({ projectId, query: debouncedQuery });
        if (active) setMembers(res.members);
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
    return () => {
      active = false;
    };
  }, [debouncedQuery, projectId, searchMembers, selectedId]);

  return (
    <div className="relative">
      <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
        Assignee *
      </label>
      <div className="relative">
        <input
          disabled={disabled}
          className="w-full rounded-lg border border-gray-700 bg-[#141619] p-2.5 pl-10 text-white focus:border-purple-500 focus:outline-none transition-all"
          placeholder="Search members..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedId) onSelect("", "");
          }}
        />
        <User className="absolute left-3 top-3 text-gray-500" size={18} />
        {loading && (
          <Loader2
            className="absolute right-3 top-3 animate-spin text-purple-500"
            size={18}
          />
        )}
      </div>

      {members.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border border-gray-700 bg-[#1e2023] shadow-xl">
          {members.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => {
                onSelect(user.id, user.name || user.email);
                setQuery(user.name || user.email);
                setMembers([]);
              }}
              className="flex w-full items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-gray-800 last:border-0"
            >
              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
                {user.name?.[0] || "?"}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">
                  {user.name}
                </div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
