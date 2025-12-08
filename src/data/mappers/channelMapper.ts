import { Channel, type ChannelProps } from "@/domain/entities/channel/Channel";

export const channelResponseToEntity = (raw: any): Channel => {
  const props: ChannelProps = {
    id: raw.id,
    projectId: raw.projectId,
    channelName: raw.channelName,

    description: raw.description ?? "",
    visibleToRoles: raw.visibleToRoles ?? [],
    permissionsByRole: raw.permissionsByRole ?? {},

    lastMessage: raw.lastMessage,
    unreadCount: raw.unreadCount,

    createdBy: raw.createdBy ?? "",
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };

  return new Channel(props);
};
