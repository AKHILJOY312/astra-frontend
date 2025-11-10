import PageBreadcrumb from "@/frameworks/ui/components/admin/common/PageBreadCrumb";
import ComponentCard from "@/frameworks/ui/components/admin/common/ComponentCard";
import LineChartOne from "@/frameworks/ui/components/admin/charts/line/LineChartOne";
import PageMeta from "@/frameworks/ui/components/admin/common/PageMeta";

export default function LineChart() {
  return (
    <>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
      </div>
    </>
  );
}
