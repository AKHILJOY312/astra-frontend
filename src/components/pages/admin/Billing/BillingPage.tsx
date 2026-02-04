// import React, { useEffect, useState } from "react";
// import { useAdminBilling } from "@/hooks/useAdminBilling";
// import type { BillingQueryParams } from "@/types/adminBilling.types";

// function BillingPage() {
//   const { billing, loading, error, fetchBillingList } = useAdminBilling();

//   // UI-owned params (not the hook’s responsibility)
//   const [params, setParams] = useState<BillingQueryParams>({
//     page: 1,
//     limit: 10,
//     search: "",
//   });

//   // Initial + reactive fetch
//   useEffect(() => {
//     fetchBillingList(params);
//   }, [params, fetchBillingList]);

//   const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setParams((prev) => ({
//       ...prev,
//       page: 1,
//       search: e.target.value,
//     }));
//   };

//   const nextPage = () => {
//     setParams((prev) => ({ ...prev, page: prev.page + 1 }));
//   };

//   const prevPage = () => {
//     setParams((prev) => ({
//       ...prev,
//       page: Math.max(1, prev.page - 1),
//     }));
//   };

//   if (loading) {
//     return <div className="p-6 text-gray-500">Loading billing data…</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Billing</h1>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search by user name or email"
//         value={params.search}
//         onChange={onSearchChange}
//         className="border px-3 py-2 rounded w-80"
//       />

//       {/* Billing Table */}
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2 border">User</th>
//             <th className="p-2 border">Plan</th>
//             <th className="p-2 border">Status</th>
//             <th className="p-2 border">Total Spent</th>
//             <th className="p-2 border">Last Payment</th>
//             <th className="p-2 border">Failures</th>
//           </tr>
//         </thead>
//         <tbody>
//           {billing?.users.map((user) => (
//             <tr key={user.userId} className="hover:bg-gray-50">
//               <td className="p-2 border">
//                 <div className="font-medium">{user.userName}</div>
//                 <div className="text-xs text-gray-500">{user.userEmail}</div>
//               </td>
//               <td className="p-2 border">{user.planName}</td>
//               <td className="p-2 border">{user.subscriptionStatus}</td>
//               <td className="p-2 border">
//                 ₹{user.totalSpent.toLocaleString()}
//               </td>
//               <td className="p-2 border">
//                 {user.lastPaymentDate
//                   ? new Date(user.lastPaymentDate).toLocaleDateString()
//                   : "—"}
//               </td>
//               <td className="p-2 border">{user.failedAttemptCount}</td>
//             </tr>
//           ))}

//           {billing?.users.length === 0 && (
//             <tr>
//               <td colSpan={6} className="p-4 text-center text-gray-500">
//                 No billing records found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={prevPage}
//           disabled={params.page === 1}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Previous
//         </button>

//         <span className="text-sm">Page {params.page}</span>

//         <button
//           onClick={nextPage}
//           disabled={
//             billing ? params.page * params.limit >= billing.totalUsers : true
//           }
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
import PageBreadcrumb from "@/components/organisms/admin/common/PageBreadCrumb";
import ComponentCard from "@/components/organisms/admin/common/ComponentCard";
import PageMeta from "@/components/organisms/admin/common/PageMeta";

import UserBillingList from "./UserBillingList";
function BillingPage() {
  return (
    <>
      <PageMeta
        title="Billing Management | Admin can view all bills"
        description="Admin can manage all users"
      />
      <PageBreadcrumb pageTitle="Billing Management" />
      <div className="space-y-6">
        <ComponentCard title="List">
          <UserBillingList />
        </ComponentCard>
      </div>
    </>
  );
}

export default BillingPage;
