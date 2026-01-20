interface AvatarProps {
    src?: string | null;
    name: string;
    size?: "sm" | "md" | "lg";
}

const sizeMap = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
};

export default function Avatar({
    src,
    name,
    size = "md",
}: AvatarProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`rounded-full object-cover ${sizeMap[size]}`}
            />
        );
    }

    return (
        <div
            className={`rounded-full bg-[#2a2d31] flex items-center justify-center text-white ${sizeMap[size]}`}
        >
            {name.charAt(0).toUpperCase()}
        </div>
    );
}
