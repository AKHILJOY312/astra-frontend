import type { Task, TaskStatus } from "@/types";
import { STATUS_LABELS } from "@/utils/constants";
import { TaskCard } from "@/components/atoms/user/task/TaskCard";
import { useEffect, useRef } from "react";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  onDragStart?: (task: Task) => void;
  onDragEnd?: () => void;
  onDrop?: (status: TaskStatus) => void;
  isDraggingOver?: boolean;
}

export const KanbanColumn = ({
  status,
  tasks,
  onOpenTask,
  onLoadMore,
  hasMore,
  loading,
  onDragStart,
  onDragEnd,
  onDrop,
  isDraggingOver = false,
}: KanbanColumnProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const columnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || loading) return;
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          onLoadMore();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  // Status color mapping
  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      todo: "border-blue-500/30 bg-blue-500/5",
      "in-progress": "border-amber-500/30 bg-amber-500/5",
      review: "border-purple-500/30 bg-purple-500/5",
      done: "border-emerald-500/30 bg-emerald-500/5",
    };
    return (
      colors[status as keyof typeof colors] ||
      "border-gray-500/30 bg-gray-500/5"
    );
  };

  const getAccentColor = (status: TaskStatus) => {
    const colors = {
      todo: "bg-blue-500",
      "in-progress": "bg-amber-500",
      review: "bg-purple-500",
      done: "bg-emerald-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getHeaderGradient = (status: TaskStatus) => {
    const gradients = {
      todo: "from-blue-500/10 to-transparent",
      "in-progress": "from-amber-500/10 to-transparent",
      review: "from-purple-500/10 to-transparent",
      done: "from-emerald-500/10 to-transparent",
    };
    return (
      gradients[status as keyof typeof gradients] ||
      "from-gray-500/10 to-transparent"
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(status);
  };

  return (
    <div
      ref={columnRef}
      className={`flex flex-col min-w-[320px] max-w-[320px] h-full transition-all duration-200 ${
        isDraggingOver ? "scale-[1.02]" : ""
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Sticky Column Header */}
      <div
        className={`sticky top-0 z-10 bg-linear-to-b ${getHeaderGradient(status)} backdrop-blur-xl pb-3`}
      >
        <div
          className={`border-2 ${getStatusColor(status)} rounded-xl p-4 shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${getAccentColor(status)} shadow-lg`}
                style={{ boxShadow: `0 0 8px currentColor` }}
              />
              <h4 className="font-bold text-gray-100 tracking-wide text-sm uppercase">
                {STATUS_LABELS[status] || status}
              </h4>
            </div>
          </div>
        </div>

        {/* Separator line */}
        <div className={`h-[2px] mt-3 ${getAccentColor(status)} opacity-20`} />
      </div>

      {/* Task Cards Container - scrolls with parent */}
      <div
        className={`flex-1 space-y-3 px-1 transition-all duration-200 ${
          isDraggingOver ? "bg-white/5 rounded-xl" : ""
        }`}
      >
        {tasks.length > 0 ? (
          <>
            {tasks.map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => onDragStart?.(task)}
                onDragEnd={onDragEnd}
                className="cursor-grab active:cursor-grabbing animate-in fade-in slide-in-from-top-1"
                style={{
                  animationDelay: `${index * 20}ms`,
                  animationFillMode: "backwards",
                  animationDuration: "200ms",
                }}
              >
                <TaskCard task={task} onOpen={onOpenTask} />
              </div>
            ))}
          </>
        ) : (
          /* Empty State Drop Zone */
          <div
            className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl transition-all duration-200 ${
              isDraggingOver
                ? `${getStatusColor(status)} border-opacity-100 scale-105`
                : "border-gray-700/30 bg-gray-800/10"
            }`}
          >
            <svg
              className="w-10 h-10 text-gray-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-gray-500 text-xs font-medium">
              {isDraggingOver ? "Drop here" : "No tasks"}
            </p>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="flex gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full ${getAccentColor(status)} animate-bounce`}
                style={{ animationDelay: "0ms" }}
              />
              <div
                className={`w-1.5 h-1.5 rounded-full ${getAccentColor(status)} animate-bounce`}
                style={{ animationDelay: "150ms" }}
              />
              <div
                className={`w-1.5 h-1.5 rounded-full ${getAccentColor(status)} animate-bounce`}
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        {hasMore && <div ref={loadMoreRef} className="h-px" />}

        {/* Bottom padding for better spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
};
