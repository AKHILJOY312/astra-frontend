import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export default function Input({
    error,
    className,
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            <input
                className={clsx(
                    "w-full px-3 py-2 rounded-lg",
                    "bg-[#1a1d21] text-white",
                    "border border-gray-800",
                    "focus:outline-none focus:ring-2 focus:ring-purple-600",
                    "placeholder:text-gray-500",
                    error && "border-red-400",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
