import Avatar from "@/components/atoms/task/Avatar";


interface MemberSearchItemProps {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    onSelect: (id: string) => void;
}

export default function MemberSearchItem({
    name,
    email,
    avatarUrl,
    onSelect,
}: MemberSearchItemProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(email)}
            className="
        w-full flex items-center gap-3 px-3 py-2
        hover:bg-[#2a2d31] rounded-lg text-left
      "
        >
            <Avatar src={avatarUrl} name={name} />

            <div className="flex flex-col">
                <span className="text-white text-sm">
                    {name}
                </span>
                <span className="text-gray-400 text-xs">
                    {email}
                </span>
            </div>
        </button>
    );
}
