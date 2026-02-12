interface ProjectStats {
  total: number;
  todo: number;
  inprogress: number;
  done: number;
  completionPercentage: number;
}
export const ProjectHero = ({
  stats,
}: {
  stats: ProjectStats;
  title: string;
}) => {
  // SVG Circle Logic
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (stats.completionPercentage / 100) * circumference;

  return (
    <div className="mb-8 p-6 rounded-3xl bg-linear-to-br from-[#232529] to-[#1a1d21] border border-gray-800 shadow-2xl pb-10">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Progress Chart */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-800"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-purple-500 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-white">
              {stats.completionPercentage}%
            </span>
            <span className="text-[10px] text-gray-500 uppercase font-bold">
              Done
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {[
            {
              label: "Total Tasks",
              value: stats.total,
              color: "text-blue-400",
            },
            { label: "To Do", value: stats.todo, color: "text-gray-400" },
            {
              label: "In Progress",
              value: stats.inprogress,
              color: "text-purple-400",
            },
            { label: "Completed", value: stats.done, color: "text-green-400" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-[#1a1d21]/50 border border-gray-800/50"
            >
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                {item.label}
              </p>
              <p className={`text-2xl font-mono font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
