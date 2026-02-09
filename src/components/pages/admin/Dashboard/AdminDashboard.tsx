import { useEffect, type ReactNode } from "react";
import {
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
} from "lucide-react";
import { useAdminBilling } from "@/hooks/useAdminBilling";

const AdminDashboard = () => {
  const { dashboard, loading, error, fetchDashboard } = useAdminBilling();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!dashboard) return null;

  const { revenue, subscriptions, users, payments } = dashboard;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Billing Overview</h1>
        <p className="text-sm text-gray-500">
          Last updated: {new Date(dashboard.lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      {/* 1. Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total MRR"
          value={`₹${revenue.mrr.toLocaleString()}`}
          trend={revenue.monthOverMonthChange}
          icon={<DollarSign className="text-blue-600" />}
        />
        <StatCard
          title="Active Subscriptions"
          value={subscriptions.active.toString()}
          subText={`${subscriptions.newThisMonth} new this month`}
          icon={<RefreshCcw className="text-green-600" />}
        />
        <StatCard
          title="Total Users"
          value={users.total.toString()}
          subText={`${users.new.thisWeek} joined this week`}
          icon={<Users className="text-purple-600" />}
        />
        <StatCard
          title="Churn Rate"
          value={`${subscriptions.churnRate}%`}
          trend={-2.5} // Example trend
          icon={<Activity className="text-orange-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Revenue by Plan Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Revenue by Plan</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm border-b">
                <th className="pb-3 font-medium">Plan Name</th>
                <th className="pb-3 font-medium">Users</th>
                <th className="pb-3 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenue.byPlan.map((plan) => (
                <tr key={plan.planName} className="border-b last:border-0">
                  <td className="py-4 font-medium text-gray-700">
                    {plan.planName}
                  </td>
                  <td className="py-4 text-gray-600">{plan.userCount}</td>
                  <td className="py-4 text-right font-semibold">
                    ₹{plan.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Payment Health */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Today's Payments</h3>
          <div className="space-y-4">
            <PaymentStatus
              label="Successful"
              count={payments.today.success}
              color="bg-green-500"
            />
            <PaymentStatus
              label="Pending"
              count={payments.today.pending}
              color="bg-yellow-500"
            />
            <PaymentStatus
              label="Failed"
              count={payments.today.failed}
              color="bg-red-500"
            />
            {/* <div className="pt-4 mt-4 border-t">
              <p className="text-sm text-gray-500">
                Refunds this month:{" "}
                <span className="font-semibold text-gray-800">
                  {payments.thisMonth.refunds}
                </span>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
type StatCardProps = {
  title: string;
  value: string | number;
  trend?: number;
  icon: ReactNode;
  subText?: string;
};
// Reusable Sub-Components
const StatCard = ({ title, value, trend, icon, subText }: StatCardProps) => (
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
type PaymentStatusProps = {
  label: string;
  count: number;
  color: string; // Tailwind class like "bg-green-500"
};
const PaymentStatus = ({ label, count, color }: PaymentStatusProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-800">{count}</span>
  </div>
);

export default AdminDashboard;
