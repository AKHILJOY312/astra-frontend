import { Calendar } from "lucide-react";

interface SubscriptionCardProps {
  subscription: {
    planName: string;
    amount: number;
    status: string;
    endDate: string;
  };
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => (
  <div className="bg-[#232529] border border-gray-800 rounded-lg p-6">
    <h4 className="font-semibold text-white mb-4">Current Subscription</h4>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <Stat label="Plan" value={subscription.planName} />
      <Stat label="Amount" value={`₹${subscription.amount}`} />
      <div>
        <p className="text-gray-500 text-xs uppercase mb-1">Status</p>
        <p
          className={`font-medium ${subscription.status === "active" ? "text-green-400" : "text-gray-400"}`}
        >
          {subscription.status}
        </p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase mb-1">Valid Until</p>
        <p className="text-white flex items-center gap-1">
          <Calendar size={14} />
          {new Date(subscription.endDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-gray-500 text-xs uppercase mb-1">{label}</p>
    <p className="text-white">{value}</p>
  </div>
);
