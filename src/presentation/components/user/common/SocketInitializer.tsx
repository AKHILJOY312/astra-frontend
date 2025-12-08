// src/components/SocketInitializer.tsx
import { useEffect } from "react";
// Assuming these are your paths
import { useAppSelector } from "@/presentation/redux/hooks";
import { messageGateway } from "@/data/gateway/MessageGateway";

function SocketInitializer() {
  // Read the authentication state from Redux
  const token = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Only attempt to connect if the user is authenticated AND a token is present
    if (isAuthenticated && token) {
      console.log("Connecting socket with token:", token.slice(0, 10) + "...");
      messageGateway.connect(token);
    }

    // Cleanup function: Disconnect when the user logs out or the component unmounts
    return () => {
      messageGateway.disconnect?.();
    };
    // The effect re-runs whenever isAuthenticated or token changes (e.g., login/logout)
  }, [isAuthenticated, token]);

  return null; // This component renders nothing, it's purely for side effects
}

export default SocketInitializer;
