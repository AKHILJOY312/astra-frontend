import { X, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeUpgradePlanModal } from "@/redux/slice/uiSlice";
import type { RootState } from "@/redux/store/store";
import { useNavigate } from "react-router-dom";

export default function UpgradePlanModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state: RootState) => state.ui.upgradePlanModal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md relative p-8">
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeUpgradePlanModal())}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 dark:bg-yellow-900/40 p-4 rounded-full">
            <AlertTriangle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          You’ve Reached Your Limit
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-3">
          Your current plan has reached its maximum usage. Upgrade now to
          continue using all features without interruption.
        </p>

        {/* Upgrade Button */}
        <button
          onClick={() => {
            dispatch(closeUpgradePlanModal());
            navigate("/upgrade");
          }}
          className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md"
        >
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
