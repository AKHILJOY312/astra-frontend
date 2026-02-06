//-----------------------------------------
//        Messages
//-----------------------------------------
export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string | null;
  uploadedAt: string;
}
export type Message = {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  text: string;
  attachments: Attachment[];
  hasReplies: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MessagesState = {
  activeChannelId: string | null;
  list: Message[];
};

export type MessageReply = {
  id: string;
  parentMessageId: string;
  senderId: string;
  text: string;
  createdAt: string;
};
