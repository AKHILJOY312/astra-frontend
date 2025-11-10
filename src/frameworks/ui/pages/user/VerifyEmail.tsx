import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");
    let timer: ReturnType<typeof setTimeout>;
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await new Promise((res) => setTimeout(res, 1500));

        if (type === "reset") {
          const res = await axios.get(
            `/api/auth/verify-reset-token?token=${token}`
          );
          setStatus("success");
          setMessage("Reset link verified! Redirecting...");
        } else {
          const res = await axios.get(`/api/auth/verify-email?token=${token}`);
          setStatus("success");
          setMessage("Email verified successfully!");
        }

        // Redirect after 3 seconds

        timer = setTimeout(() => {
          if (type === "reset") {
            navigate(`/reset-password?token=${token}`);
          } else {
            navigate("/login");
          }
        }, 3000);
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. Link may be expired or invalid."
        );
      }
    };

    verifyEmail();

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl text-center space-y-6">
        {/* Icon */}
        <div
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center
          ${
            status === "loading"
              ? "bg-blue-100"
              : status === "success"
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          {status === "loading" && (
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          )}
          {status === "success" && (
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {status === "error" && (
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        {/* Message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Verified!"}
            {status === "error" && "Verification Failed"}
          </h2>
          <p
            className={`text-sm ${
              status === "success"
                ? "text-green-600"
                : status === "error"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {message}
          </p>
        </div>

        {/* Auto-redirect hint */}
        {status === "success" && (
          <p className="text-xs text-gray-500">
            Redirecting to login in 3 seconds...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
