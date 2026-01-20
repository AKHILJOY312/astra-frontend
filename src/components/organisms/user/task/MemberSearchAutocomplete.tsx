import Input from "@/components/atoms/task/Input";
import MemberSearchItem from "@/components/molecules/user/task/MemberSearchItem";
import { useState, useEffect } from "react";


interface Member {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
}

interface Props {
    searchMembers: (query: string) => Promise<Member[]>;
    onSelect: (member: Member) => void;
}

export default function MemberSearchAutocomplete({
    searchMembers,
    onSelect,
}: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            const members = await searchMembers(query);
            setResults(members);
            setLoading(false);
        }, 400);

        return () => clearTimeout(timeout);
    }, [query, searchMembers]);

    return (
        <div className="relative">
            <Input
                placeholder="Search members…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {results.length > 0 && (
                <div
                    className="
            absolute z-20 mt-2 w-full rounded-xl
            bg-[#232529] border border-gray-800
            max-h-64 overflow-y-auto
          "
                >
                    {results.map((member) => (
                        <MemberSearchItem
                            key={member.id}
                            {...member}
                            onSelect={() => {
                                onSelect(member);
                                setQuery("");
                                setResults([]);
                            }}
                        />
                    ))}
                </div>
            )}

            {loading && (
                <div className="absolute right-3 top-3 text-gray-400 text-xs">
                    Searching…
                </div>
            )}
        </div>
    );
}
