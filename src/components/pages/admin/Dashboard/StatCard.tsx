import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  trend?: number;
  icon: ReactNode;
  subText?: string;
};
// Reusable Sub-Components
export const StatCard = ({
  title,
  value,
  trend,
  icon,
  subText,
}: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      {trend && (
        <span
          className={`flex items-center text-xs font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {trend >= 0 ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    {subText && <p className="text-xs text-gray-400 mt-1">{subText}</p>}
  </div>
);
