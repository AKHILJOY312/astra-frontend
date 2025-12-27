// src/presentation/pages/user/PaymentFailed.tsx
import { XCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-950 dark:to-red-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Failed
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Something went wrong. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/upgrade"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
