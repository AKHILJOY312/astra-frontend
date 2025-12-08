import { Loader2 } from "lucide-react";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F12] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 via-pink-500/10 to-blue-600/20 animate-pulse" />
        <div className="absolute inset-0 bg-linear-to-tl from-cyan-500/10 via-transparent to-purple-600/10 animate-ping" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative">
          <Loader2
            className="w-16 h-16 md:w-20 md:h-20 text-white animate-spin"
            strokeWidth={2.5}
          />

          <div className="absolute inset-0 -m-4">
            <div className="h-full w-full rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin opacity-60 blur-xl" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Loading your workspace
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-400 font-medium">
            Preparing everything for you...
          </p>
        </div>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-linear-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-xs text-gray-500 font-medium tracking-wider">
          A S T R A
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
