import { io, Socket } from "socket.io-client";

// Define your event payloads once
interface ServerToClientEvents {
  "message:new": (message: {
    id: string;
    channelId: string;
    senderId: string;
    senderName: string;
    text: string;
    hasAttachments: boolean;
    hasReplies: boolean;
    createdAt: string;
    updatedAt: string;
  }) => void;
}

interface ClientToServerEvents {
  "channel:join": (channelId: string) => void;
  "message:send": (payload: {
    text: string;
    channelId: string;
    projectId?: string;
  }) => void;
  "channel:leave": (data: { channelId: string }) => void;
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

class MessageGateway {
  private socket: SocketType | null = null;

  connect(token: string): void {
    //console.log("📡 [MessageGateway.connect] Called with token:", token);

    this.socket = io("http://localhost:3000", {
      auth: { token },
      transports: ["websocket"],
    });

    //console.log("🔌 [MessageGateway] Socket instance created:", this.socket);

    this.socket.on("connect", () => {
      //console.log("✅ [MessageGateway] Connected to Socket.IO server");
      //console.log("➡️ Socket ID:", this.socket?.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ [MessageGateway] Connect error:", err.message);
      console.error(err);
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("⚠️ [MessageGateway] Socket disconnected:", reason);
    });
    this.socket.onAny((event, ...args) => {
      //console.log(`📡 [SOCKET-EVENT] ${event}`, args);
    });
  }

  joinChannel(channelId: string): void {
    //console.log("📥 [MessageGateway.joinChannel] Joining channel:", channelId);
    //console.log("➡️ Socket connected?", this.socket?.connected);

    this.socket?.emit("channel:join", channelId);
  }

  sendMessage(payload: {
    text: string;
    channelId: string;
    projectId?: string;
  }): void {
    //console.log("✉️ [MessageGateway.sendMessage] Sending message");
    //console.log("➡️ Payload:", payload);
    //console.log("➡️ Socket connected?", this.socket?.connected);
    //console.log("➡️ Socket ID:", this.socket?.id);

    if (!this.socket?.connected) {
      console.error(
        "❌ [MessageGateway.sendMessage] Cannot send; socket not connected."
      );
      return;
    }

    //console.log("📤 [MessageGateway] Emitting 'message:send'");
    this.socket.emit("message:send", payload);
  }

  leaveChannel(channelId: string): void {
    //console.log("📤 [MessageGateway.leaveChannel] Leaving channel:", channelId);
    this.socket?.emit("channel:leave", { channelId });
  }

  subscribeToNewMessages(
    callback: (message: {
      id: string;
      channelId: string;
      senderId: string;
      senderName: string;
      text: string;
      hasAttachments: boolean;
      hasReplies: boolean;
      createdAt: string;
      updatedAt: string;
    }) => void
  ): () => void {
    //console.log(
    //   "👂 [MessageGateway.subscribeToNewMessages] Subscribing to 'message:new'"
    // );

    const handler = (msg: any) => {
      //console.log("📩 [MessageGateway] Received 'message:new' event:", msg);
      callback(msg);
    };

    this.socket?.on("message:new", handler);

    return () => {
      //console.log("🧹 [MessageGateway] Unsubscribing from 'message:new'");
      this.socket?.off("message:new", handler);
    };
  }

  disconnect(): void {
    //console.log("🔌 [MessageGateway.disconnect] Disconnecting socket...");
    this.socket?.disconnect();
    //console.log("❎ [MessageGateway] Socket disconnected.");
    this.socket = null;
  }

  updateToken(token: string) {
    //console.log("🔄 [MessageGateway.updateToken] Updating token:", token);

    if (this.socket) {
      //console.log("🔧 Socket exists — updating auth & reconnecting...");
      this.socket.auth = { token };
      this.socket.connect();
    } else {
      //console.log("⚠️ No socket instance found — creating new connection...");
      this.connect(token);
    }
  }
}

export const messageGateway = new MessageGateway();
