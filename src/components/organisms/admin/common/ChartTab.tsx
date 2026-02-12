interface ChartTabProps {
  selected: string;
  onChange: (value: string) => void;
}

export const ChartTab = ({ selected, onChange }: ChartTabProps) => {
  const tabs = [
    { id: "monthly", label: "Monthly" },
    { id: "quarterly", label: "Quarterly" },
    { id: "annually", label: "Annually" },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 font-medium rounded-md text-sm transition-all ${
            selected === tab.id
              ? "bg-white shadow-sm text-gray-900 dark:bg-gray-800 dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
