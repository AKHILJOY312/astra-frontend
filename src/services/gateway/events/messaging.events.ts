// Define your event payloads once
export interface ServerToClientEvents {
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

export interface ClientToServerEvents {
  "channel:join": (channelId: string) => void;
  "message:send": (payload: {
    text: string;
    channelId: string;
    projectId?: string;
    attachments?: Array<{
      fileName: string;
      fileType: string;
      fileSize: number;
      fileUrl: string;
      key?: string;
    }>;
  }) => void;
  "channel:leave": (data: { channelId: string }) => void;
}
