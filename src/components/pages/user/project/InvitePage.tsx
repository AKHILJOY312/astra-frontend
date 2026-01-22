// src/pages/InvitePage.tsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; // Your auth context/custom hook
import api from "@/services/api"; // Your axios/instance
import Button from "@/components/atoms/admin/button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/organisms/user/Card/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { PATHS } from "@/routes/routeConstant";

type Status = "loading" | "needs-auth" | "accepting" | "success" | "error";

export default function InvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-accept if user is already logged in
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid invitation link");
      return;
    }

    if (authLoading) return; // Wait for auth state

    if (user) {
      // User is logged in → accept automatically
      acceptInvitation();
    } else {
      // User not logged in → show login/signup prompt
      setStatus("needs-auth");
    }
  }, [token, user, authLoading]);

  const acceptInvitation = async () => {
    setStatus("accepting");
    try {
      await api.post("/projects/invitations/accept", { token });
      setStatus("success");

      // Redirect to dashboard or specific project after 2s
      setTimeout(() => {
        navigate(PATHS.PROJECT.DASHBOARD); // or `/projects/${projectId}`
      }, 2000);
    } catch (err) {
      setStatus("error");

      let message =
        "Failed to accept invitation. The link may be invalid or expired.";

      if (axios.isAxiosError(err)) {
        // Safely access nested data if it exists
        message = err.response?.data?.message || message;
      } else if (err instanceof Error) {
        // Handle standard JS errors
        message = err.message;
      }

      setErrorMessage(message);
    }
  };

  const handleLogin = () => {
    // Preserve token after login
    navigate(PATHS.AUTH.LOGIN, { state: { fromInvite: token } });
  };

  const handleSignup = () => {
    navigate(PATHS.AUTH.SIGN_UP, { state: { fromInvite: token } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Project Invitation</CardTitle>
          <CardDescription>
            You've been invited to collaborate on a project
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-6">
          {status === "loading" || status === "accepting" ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-lg">
                {status === "accepting"
                  ? "Accepting invitation..."
                  : "Processing..."}
              </p>
            </>
          ) : status === "needs-auth" ? (
            <>
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  To accept this invitation, please log in or create an account.
                  After login click on the same link and start chatting with you
                  team,
                </p>
                <div className="flex flex-col gap-3 mt-6">
                  <Button onClick={handleLogin} className="w-full">
                    Log In
                  </Button>
                  <Button
                    onClick={handleSignup}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-600" />
              <div className="text-center">
                <p className="text-xl font-semibold">Invitation Accepted!</p>
                <p className="text-gray-600 mt-2">
                  Welcome! You're now a member, start chatting and building.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Redirecting to your dashboard...
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-600" />
              <div className="text-center">
                <p className="text-xl font-semibold text-red-700">
                  Invitation Failed
                </p>
                <p className="text-gray-600 mt-2">{errorMessage}</p>
                <Button onClick={() => navigate(PATHS.HOME)} className="mt-6">
                  Go to Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
