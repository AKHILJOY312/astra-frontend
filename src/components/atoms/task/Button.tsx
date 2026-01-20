import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    loading?: boolean;
}

export default function Button({
    variant = "primary",
    loading,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={clsx(
                "px-4 py-2 rounded-lg font-medium transition-all",
                "text-white disabled:opacity-50 disabled:cursor-not-allowed",
                {
                    "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90":
                        variant === "primary",

                    "bg-[#232529] border border-gray-800 hover:bg-[#2a2d31]":
                        variant === "secondary",

                    "bg-red-500 hover:bg-red-600":
                        variant === "danger",
                },
                className
            )}
            {...props}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}
