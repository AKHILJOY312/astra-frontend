import type { Payment } from "@/types";
import { Download } from "lucide-react";

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
  downloadingId: string | null;
  onDownload: (id: string) => void;
}

export const PaymentTable = ({
  payments,
  loading,
  downloadingId,
  onDownload,
}: PaymentTableProps) => (
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
            <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
              Loading…
            </td>
          </tr>
        ) : (
          payments.map((p) => (
            <tr
              key={p.paymentId}
              className="border-b border-gray-800 hover:bg-[#2a2d31]"
            >
              <td className="px-4 py-3">{p.invoiceNumber ?? "—"}</td>
              <td className="px-4 py-3">{p.planName}</td>
              <td className="px-4 py-3">₹{p.amount.toFixed(2)}</td>
              <td
                className={`px-4 py-3 font-medium ${p.status === "captured" ? "text-green-400" : "text-red-400"}`}
              >
                {p.status}
              </td>
              <td className="px-4 py-3">
                {new Date(p.paidAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                {p.canDownloadInvoice && (
                  <button
                    onClick={() => onDownload(p.paymentId)}
                    disabled={downloadingId === p.paymentId}
                    className="text-purple-400 hover:text-purple-300 disabled:opacity-50"
                  >
                    {downloadingId === p.paymentId ? (
                      "..."
                    ) : (
                      <Download size={16} />
                    )}
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
