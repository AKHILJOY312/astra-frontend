// src/presentation/pages/user/PaymentSuccess.tsx
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-950 dark:to-emerald-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Welcome to the Pro plan. Your workspace is now upgraded.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
        >
          Go to Dashboard
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
