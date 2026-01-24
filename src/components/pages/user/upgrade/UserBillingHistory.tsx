import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  downloadInvoice,
  getPaymentHistoryForMe,
} from "@/services/subscription.service";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { PATHS } from "@/routes/routeConstant";
import { BillingEmptyState } from "@/components/atoms/user/Billing/BillingEmptyState";
import { SubscriptionCard } from "@/components/atoms/user/Billing/SubscriptionCard";
import { PaymentTable } from "@/components/atoms/user/Billing/PaymentTable";
import type { BillingResponse } from "@/types";

const UserBillingHistory = () => {
  const [data, setData] = useState<BillingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const res = await getPaymentHistoryForMe({
        page,
        limit: 5,
        search: debouncedSearch,
      });
      setData(res.data);
      setLoading(false);
    };

    fetchHistory();
  }, [page, debouncedSearch]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);
  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      setDownloadingId(paymentId);
      const res = await downloadInvoice(paymentId);

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice download failed", err);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading && !data) return <p className="p-6 text-gray-400">Loading...</p>;
  if (!data) return null;

  if (!data.subscription && data.payments.length === 0) {
    return (
      <BillingEmptyState onUpgrade={() => navigate(PATHS.BILLING.UPGRADE)} />
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d21] text-gray-100">
      <div className="max-w-5xl mx-auto p-6 pt-24 space-y-8">
        <header>
          <h2 className="text-3xl font-bold text-white">Billing History</h2>
          <p className="text-gray-400 mt-1">
            View your subscription and payment records
          </p>
        </header>

        {data.subscription && (
          <SubscriptionCard subscription={data.subscription} />
        )}

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice..."
            className="w-full bg-[#1a1d21] border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm"
          />
        </div>

        <PaymentTable
          payments={data.payments}
          loading={loading}
          downloadingId={downloadingId}
          onDownload={handleDownloadInvoice}
        />

        {/* Pagination Logic */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="..."
            >
              Prev
            </button>
            <button
              disabled={page === data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="..."
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBillingHistory;
