// import EcommerceMetrics from "@/components/organisms/admin/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "@/components/organisms/admin/ecommerce/MonthlySalesChart";
// import StatisticsChart from "@/components/organisms/admin/ecommerce/StatisticsChart";
// import MonthlyTarget from "@/components/organisms/admin/ecommerce/MonthlyTarget";
// import RecentOrders from "@/components/organisms/admin/ecommerce/RecentOrders";
// import DemographicCard from "@/components/organisms/admin/ecommerce/DemographicCard";
import PageMeta from "@/components/organisms/admin/common/PageMeta";
import AdminDashboard from "./AdminDashboard";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard"
        description="View and manage your admin dashboard"
      />
      {/* <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
         
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </div> */}
      <AdminDashboard></AdminDashboard>
    </>
  );
}
