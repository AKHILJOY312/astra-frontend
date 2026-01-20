import TaskCardHeader from "@/components/molecules/user/task/TaskCardHeader";

interface Task {
    id: string;
    title: string;
    priority: "high" | "medium" | "low";
}

interface Props {
    title: string;
    tasks: Task[];
}

export default function KanbanColumn({
    title,
    tasks,
}: Props) {
    return (
        <div
            className="
        flex flex-col gap-3 p-3 rounded-xl
        bg-[#1a1d21] border border-gray-800
        min-h-[300px]
      "
        >
            <h2 className="text-gray-300 text-sm font-semibold">
                {title}
            </h2>

            {tasks.length === 0 && (
                <div className="text-gray-500 text-xs italic">
                    No tasks
                </div>
            )}

            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="
            bg-[#232529] rounded-lg p-3
            hover:bg-[#2a2d31]
            transition cursor-pointer
          "
                >
                    <TaskCardHeader
                        title={task.title}
                        priority={task.priority}
                    />
                </div>
            ))}
        </div>
    );
}
