import { useEffect } from "react";
import { Users, DollarSign, RefreshCcw } from "lucide-react";
import { useAdminBilling } from "@/hooks/useAdminBilling";
import StatisticsChart from "@/components/organisms/admin/ecommerce/StatisticsChart";
import { StatCard } from "./StatCard";
import { PaymentStatus } from "./PaymentStatus";

const AdminDashboard = () => {
  const {
    dashboard,
    loading,
    chartLoading,
    error,
    fetchDashboard,
    fetchChartData,
  } = useAdminBilling();

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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Billing Overview</h1>
        <p className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
          Last updated: {new Date(dashboard.lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      {/* 1. Main Stats Grid - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        {/* Added a 4th dummy or secondary stat to fill the 4-column grid properly */}
        <StatCard
          title="Today's Revenue"
          value={`₹${revenue.today?.toLocaleString() || 0}`}
          subText="Direct captured payments"
          icon={<DollarSign className="text-orange-600" />}
        />
      </div>

      {/* 2. Full Width Chart Section */}
      <div className="w-full">
        <StatisticsChart
          isLoading={chartLoading}
          onPeriodChange={fetchChartData}
        />
      </div>

      {/* 3. Bottom Grid: Table (2/3) and Health (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Plan Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-4 text-lg">
            Revenue by Plan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b">
                  <th className="pb-3 font-semibold">Plan Name</th>
                  <th className="pb-3 font-semibold">Users</th>
                  <th className="pb-3 font-semibold text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {revenue.byPlan.map((plan) => (
                  <tr
                    key={plan.planName}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 font-medium text-gray-700">
                      {plan.planName}
                    </td>
                    <td className="py-4 text-gray-600">{plan.userCount}</td>
                    <td className="py-4 text-right font-bold text-gray-900">
                      ₹{plan.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Health */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h3 className="font-semibold text-gray-700 mb-4 text-lg">
            Today's Payments
          </h3>
          <div className="space-y-6 my-auto">
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
          </div>
          <div className="mt-6 pt-4 border-t border-gray-50 text-xs text-gray-400 text-center">
            Automatic refresh every 5 minutes
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
