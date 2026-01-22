import { Edit2, Trash2 } from "lucide-react";

// --- Sub-Component: Modal Footer ---
interface FooterProps {
  isManager: boolean;
  isEditing: boolean;
  onDelete: () => void;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export const ModalFooter = ({
  isManager,
  isEditing,
  onDelete,
  onSave,
  onEdit,
  onCancel,
}: FooterProps) => {
  if (!isManager) return null;
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-800">
      <button
        onClick={() => window.confirm("Delete?") && onDelete()}
        className="flex items-center gap-2 text-xs text-red-400"
      >
        <Trash2 size={14} /> Delete Task
      </button>
      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button onClick={onCancel} className="text-xs text-gray-400 px-3">
              Cancel
            </button>
            <button
              onClick={onSave}
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-2 text-xs font-bold text-white"
          >
            <Edit2 size={14} /> Edit Task
          </button>
        )}
      </div>
    </div>
  );
};
