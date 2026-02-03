import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { PATHS } from "@/routes/routeConstant";
import { verifyResetToken, verifyUserEmail } from "@/services/auth.service";

interface BackendError {
  message: string;
}

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const type = searchParams.get("type"); // "reset" or null/undefined for email verification

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    // Early exit if no token
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    const verify = async () => {
      try {
        // Small artificial delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (type === "reset") {
          await verifyResetToken(token);
          setStatus("success");
          setMessage("Reset link verified! Redirecting...");
        } else {
          await verifyUserEmail(token);
          setStatus("success");
          setMessage("Email verified successfully!");
        }

        // Redirect after 3 seconds
        redirectTimer = setTimeout(() => {
          if (type === "reset") {
            navigate(`/reset-password?token=${token}`);
          } else {
            navigate(PATHS.AUTH.LOGIN);
          }
        }, 3000);
      } catch (error) {
        const axiosError = error as AxiosError<BackendError>;
        setStatus("error");
        setMessage(
          axiosError.response?.data?.message ||
            "Verification failed. The link may be expired or invalid.",
        );
      }
    };

    verify();

    // Cleanup timer on unmount or re-run
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [token, type, navigate]); // Added 'type' to dependencies → warning fixed

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl text-center space-y-6">
        {/* Status Icon */}
        <div
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
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

        {/* Redirect hint */}
        {status === "success" && (
          <p className="text-xs text-gray-500">Redirecting in 3 seconds...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
