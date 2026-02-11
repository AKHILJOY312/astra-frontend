import { useEffect } from "react";
import { Users, DollarSign, RefreshCcw } from "lucide-react";
import { useAdminBilling } from "@/hooks/useAdminBilling";
import StatisticsChart from "@/components/organisms/admin/ecommerce/StatisticsChart";
// import MonthlyTarget from "@/components/organisms/admin/ecommerce/MonthlyTarget";
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
          </div>
        </div>
        <div className="col-span-12">
          <StatisticsChart
            isLoading={chartLoading}
            onPeriodChange={fetchChartData}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
