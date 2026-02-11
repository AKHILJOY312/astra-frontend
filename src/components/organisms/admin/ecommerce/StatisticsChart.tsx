import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { ChartTab } from "../common/ChartTab";
import { useEffect, useState, useMemo } from "react";

export interface ChartData {
  sales: number[];
  revenue: number[];
  categories: string[];
}

interface StatisticsChartProps {
  isLoading: boolean;
  onPeriodChange: (period: string) => Promise<ChartData | undefined | void>;
}

export default function StatisticsChart({
  isLoading,
  onPeriodChange,
}: StatisticsChartProps) {
  const [activeTab, setActiveTab] = useState("monthly");
  const [data, setData] = useState<ChartData | null>(null);

  const loadData = async (period: string) => {
    const result = await onPeriodChange(period);
    if (result && result.categories.length > 0) {
      // Ensure all values are actual numbers to prevent SVG "NaN" errors
      const sanitizedData = {
        categories: result.categories,
        sales: result.sales.map((val) => Number(val) || 0),
        revenue: result.revenue.map((val) => Number(val) || 0),
      };
      setData(sanitizedData);
    }
  };

  useEffect(() => {
    loadData("monthly");
  }, []);

  const handleTabChange = (newPeriod: string) => {
    setActiveTab(newPeriod);
    loadData(newPeriod);
  };

  // We use useMemo so options don't trigger unnecessary re-renders
  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        fontFamily: "Outfit, sans-serif",
        toolbar: { show: false },
        // Disable animations if you keep seeing "d" attribute errors during transitions
        animations: { enabled: false },
      },
      colors: ["#465FFF", "#9CB9FF"],
      stroke: { curve: "straight", width: 2 },
      fill: {
        type: "gradient",
        gradient: { opacityFrom: 0.55, opacityTo: 0 },
      },
      xaxis: {
        type: "category",
        categories: data?.categories || [],
        tooltip: { enabled: false },
      },
      tooltip: {
        enabled: true,
        x: { format: undefined }, // Crucial: Don't let it try to format as date
      },
    }),
    [data?.categories],
  );

  const series = useMemo(
    () => [
      { name: "Sales", data: data?.sales || [] },
      { name: "Revenue", data: data?.revenue || [] },
    ],
    [data?.sales, data?.revenue],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Report for {activeTab}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab selected={activeTab} onChange={handleTabChange} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-900/10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="min-w-[1000px] xl:min-w-full">
          {/* 1. Key forces fresh render 
            2. Only render if we have data to prevent path errors
          */}
          {data && data.categories.length > 0 ? (
            <Chart
              key={`${activeTab}-${data.categories.length}`}
              options={options}
              series={series}
              type="area"
              height={310}
            />
          ) : (
            <div className="h-[310px] flex items-center justify-center text-gray-400">
              No data available for this period
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
