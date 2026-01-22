import type { TaskStatus } from "@/types";
import { X } from "lucide-react";

// --- Sub-Component: Modal Header ---
export const ModalHeader = ({
  title,
  status,
  onClose,
}: {
  title: string;
  status: TaskStatus;
  onClose: () => void;
}) => (
  <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-[#232529]">
    <div className="flex items-center gap-2">
      <div
        className={`h-2 w-2 rounded-full ${status === "done" ? "bg-emerald-500" : "bg-blue-500"} animate-pulse`}
      />
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
        {title}
      </h3>
    </div>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-white transition-colors"
    >
      <X size={20} />
    </button>
  </div>
);
