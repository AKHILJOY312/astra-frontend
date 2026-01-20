import type { TaskPriority } from "@/types";
import clsx from "clsx";



interface BadgeProps {
    label: string;
    variant?: TaskPriority;
}

export default function Badge({
    label,
    variant = "low",
}: BadgeProps) {
    return (
        <span
            className={clsx(
                "px-2 py-1 rounded text-xs font-medium",
                {
                    "text-green-400 bg-green-400/10": variant === "high",
                    "text-yellow-400 bg-yellow-400/10": variant === "medium",
                    "text-red-400 bg-red-400/10": variant === "low",
                }
            )}
        >
            {label}
        </span>
    );
}
