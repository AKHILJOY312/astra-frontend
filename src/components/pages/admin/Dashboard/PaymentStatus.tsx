type PaymentStatusProps = {
  label: string;
  count: number;
  color: string; // Tailwind class like "bg-green-500"
};
export const PaymentStatus = ({ label, count, color }: PaymentStatusProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-800">{count}</span>
  </div>
);
