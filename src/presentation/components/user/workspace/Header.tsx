import useGoBack from "@/presentation/hooks/useGoBack";
import {
  Search,
  HelpCircle,
  Bell,
  Mic,
  Headphones,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const cn = (...inputs: (string | undefined | false)[]) =>
  inputs.filter(Boolean).join(" ");

export default function SlackHeader() {
  let navigate = useNavigate();
  console.log;
  function handleupGrade() {
    navigate("/upgrade");
  }
  const goBack = useGoBack();
  const userStatus = "online"; // online, away, dnd

  return (
    <header className="fixed top-0 left-[70px] right-0 z-40 flex h-12 justify-end  border-b border-white/10 bg-[#4F1B60] px-4 text-white ">
      <button
        onClick={goBack}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-white/10 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back</span>
      </button>
      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <input
            type="text"
            placeholder="Search in #general"
            className="w-64 rounded-md bg-white/10 py-1.5 pl-10 pr-3 text-sm placeholder-white/50 focus:outline-none focus:bg-white/20 transition"
          />
        </div>

        {/* Help */}
        <button className="p-2 hover:bg-white/10 rounded-md transition">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/10 rounded-md transition">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button
          onClick={() => {
            handleupGrade();
          }}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-1.5 text-sm font-semibold text-black hover:from-yellow-400 hover:to-amber-400 transition shadow-md"
        >
          <Sparkles className="h-4 w-4" />
          Upgrade
        </button>
        {/* Voice / Presence */}
        <div className="flex items-center gap-1">
          <button
            className={cn(
              "p-2 rounded-md transition",
              userStatus === "online" ? "text-red-400" : "hover:bg-white/10"
            )}
          >
            {userStatus === "online" ? (
              <Headphones className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* User Menu */}
        {/* <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/10 transition">
          <div className="relative">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold">
              JD
            </div>
            <div
              className={cn(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#4F1B60]",
                userStatus === "online" && "bg-green-500"
                //   userStatus === "away" && "bg-yellow-500",
                //   userStatus === "dnd" && "bg-red-500"
              )}
            />
          </div>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </button> */}
      </div>
    </header>
  );
}
