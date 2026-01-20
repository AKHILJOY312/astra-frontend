import Badge from "@/components/atoms/task/Badge";


interface TaskCardHeaderProps {
    title: string;
    priority: "high" | "low" | "medium";
}

const priorityMap = {
    high: { label: "High", variant: "error" as const },
    medium: { label: "Medium", variant: "warning" as const },
    low: { label: "Low", variant: "neutral" as const },
};

export default function TaskCardHeader({
    title,
    priority,
}: TaskCardHeaderProps) {
    const badge = priorityMap[priority];

    return (
        <div className="flex items-start justify-between gap-2">
            <h3 className="text-white text-sm font-medium line-clamp-2">
                {title}
            </h3>

            <Badge
                label={badge.label}
                variant={badge.variant}
            />
        </div>
    );
}
