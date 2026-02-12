// --- Status Badge Component ---
export const TaskStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    done: "bg-green-500/10 text-green-500 border-green-500/20",
    inprogress: "bg-purple-500/10 text-purple-500 border-purple-400/20",
    todo: "bg-gray-800 text-gray-400 border-gray-700",
  };
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-tighter ${styles[status] || styles.todo}`}
    >
      {status}
    </span>
  );
};
