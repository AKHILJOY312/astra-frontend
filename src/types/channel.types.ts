//-----------------------------------------
//        Channel
//-----------------------------------------

export type Channel = {
  id: string;
  projectId: string;
  channelName: string;
  description: string;
  createdBy: string;
  visibleToRoles: string[];
  permissionsByRole: Record<string, "view" | "message" | "manager">;
  lastMessage?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateChannel = {
  channelName: string;
  description?: string;

  visibleToRoles: ("manager" | "lead" | "member")[];
  permissionsByRole: Record<
    "manager" | "lead" | "member",
    "view" | "message" | "manager"
  >;
};

export type CreateChannelResult = {
  channel: Channel;
};

export type EditChannel = {
  channelName?: string;
  description?: string;

  visibleToRoles?: ("manager" | "lead" | "member")[];
  permissionsByRole?: Record<
    "manager" | "lead" | "member",
    "view" | "message" | "manager"
  >;
};

export type EditChannelResult = {
  updated: Channel;
};

export type DeleteChannel = {
  channelId: string;
  userId: string;
};

export type DeleteChannelResult = {
  deleted: Channel | null;
};

export type ListProjectChannels = {
  projectId: string;
  userId: string;
};

export type ListProjectChannelsResult = {
  channels: Channel[];
};

export type ChannelResponse = {
  id: string;
  projectId: string;
  channelName: string;

  description?: string;
  visibleToRoles?: string[];
  permissionsByRole?: Record<string, "view" | "message" | "manager">;

  lastMessage?: string;
  unreadCount?: number;

  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type ChannelState = {
  channels: Channel[];
  loading: boolean;
  activeChannelId: string | null;
  activeChannel: Channel | null;
  error: string | null;
};

export type EditChannelModalProps = {
  onClose: () => void;
  channel: Channel; // ← Now correct
  projectId: string;
};
export type Role = "manager" | "lead" | "member";
export type Permission = "manager" | "view" | "message";
export type CreateChannelModalProps = {
  onClose: () => void;
  projectId: string;
};
