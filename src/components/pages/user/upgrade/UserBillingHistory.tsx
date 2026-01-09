import { useEffect, useState } from "react";
import { Calendar, Download, Search } from "lucide-react";
import { getPaymentHistoryForMe } from "@/services/subscription.service";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

interface BillingResponse {
  subscription: {
    planName: string;
    startDate: string;
    endDate: string;
    status: "active" | "expired" | "cancelled";
    amount: number;
  } | null;
  payments: {
    invoiceNumber?: string;
    planName: string;
    amount: number;
    currency: string;
    status: "pending" | "captured" | "failed";
    method: string;
    paidAt: string;
    canDownloadInvoice: boolean;
  }[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

const UserBillingHistory = () => {
  const [data, setData] = useState<BillingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
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

  if (loading) {
    return <p className="p-6 text-gray-400">Loading billing history…</p>;
  }

  if (!data) return null;
  const hasNoPayments = !data.subscription && data.payments.length === 0;
  if (hasNoPayments) {
    return (
      <div className="min-h-screen bg-[#1a1d21] text-gray-100">
        <div className="max-w-3xl mx-auto p-6 pt-32 text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">No Billing History</h2>

          <p className="text-gray-400">
            You don’t have any active subscriptions or payment records yet.
          </p>

          <div className="mt-6">
            <button
              onClick={() => {
                navigate("/upgrade");
              }}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium"
            >
              Upgrade Your Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d21] text-gray-100">
      <div className="max-w-5xl mx-auto p-6 pt-24 space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white">Billing History</h2>
          <p className="text-gray-400 mt-1">
            View your subscription and payment records
          </p>
        </div>

        {/* Subscription Card */}
        {data.subscription && (
          <div className="bg-[#232529] border border-gray-800 rounded-lg p-6">
            <h4 className="font-semibold text-white mb-4">
              Current Subscription
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase mb-1">Plan</p>
                <p className="text-white">{data.subscription.planName}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase mb-1">Amount</p>
                <p className="text-white">₹{data.subscription.amount}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase mb-1">Status</p>
                <p
                  className={`font-medium ${
                    data.subscription.status === "active"
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {data.subscription.status}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase mb-1">
                  Valid Until
                </p>
                <p className="text-white flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(data.subscription.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice or plan…"
            className="w-full bg-[#1a1d21] border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-600"
          />
        </div>

        {/* Payments Table */}
        <div className="bg-[#232529] border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#1a1d21] border-b border-gray-800 text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Invoice</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    Loading…
                  </td>
                </tr>
              ) : (
                data.payments.map((p, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-800 hover:bg-[#2a2d31]"
                  >
                    <td className="px-4 py-3">{p.invoiceNumber ?? "—"}</td>
                    <td className="px-4 py-3">{p.planName}</td>
                    <td className="px-4 py-3">₹{p.amount.toFixed(2)}</td>
                    <td
                      className={`px-4 py-3 font-medium ${
                        p.status === "captured"
                          ? "text-green-400"
                          : p.status === "failed"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {p.status}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(p.paidAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.canDownloadInvoice && (
                        <button className="text-purple-400 hover:text-purple-300">
                          <Download size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border border-gray-700 rounded hover:bg-[#2a2d31] disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page === data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border border-gray-700 rounded hover:bg-[#2a2d31] disabled:opacity-40"
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
