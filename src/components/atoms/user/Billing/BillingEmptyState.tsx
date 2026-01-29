export const BillingEmptyState = ({ onUpgrade }: { onUpgrade: () => void }) => (
  <div className="min-h-screen bg-[#1a1d21] text-gray-100">
    <div className="max-w-3xl mx-auto p-6 pt-32 text-center space-y-4">
      <h2 className="text-3xl font-bold text-white">No Billing History</h2>
      <p className="text-gray-400">
        You don’t have any active subscriptions or payment records yet.
      </p>
      <div className="mt-6">
        <button
          onClick={onUpgrade}
          className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium"
        >
          Upgrade Your Plan
        </button>
      </div>
    </div>
  </div>
);
