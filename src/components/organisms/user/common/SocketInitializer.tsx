// src/components/SocketInitializer.tsx
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { messageGateway } from "@/services/gateway/MessageGateway";
import { meetingGateway } from "@/services/gateway/MeetingGateway ";

function SocketInitializer() {
  const token = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    console.log(
      "🔐 initializing socket with token",
      token.slice(0, 10) + "...",
    );

    messageGateway.connect(token);

    const socket = messageGateway.getSocket();
    if (!socket) return;

    const onConnect = () => {
      console.log(" socket connected", socket.id);
      meetingGateway.connect(socket);
    };

    const onError = (err: unknown) => {
      if (err instanceof Error) {
        console.error(" socket connection error", err.message);
      } else {
        console.error(" socket connection error", err);
      }
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
      meetingGateway.disconnect();
      messageGateway.disconnect?.();
    };
  }, [isAuthenticated, token]);

  return null;
}

export default SocketInitializer;
