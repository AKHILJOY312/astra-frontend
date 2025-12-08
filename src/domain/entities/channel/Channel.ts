export interface ChannelProps {
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
}

export class Channel {
  private readonly props: ChannelProps;

  constructor(props: ChannelProps) {
    this.props = Object.freeze({
      ...props,
      description: props.description || "",
      visibleToRoles: props.visibleToRoles || [],
      permissionsByRole: props.permissionsByRole || {},
    });
  }

  get id(): string {
    return this.props.id;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get channelName(): string {
    return this.props.channelName;
  }

  get description(): string {
    return this.props.description;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get visibleToRoles(): string[] {
    return [...this.props.visibleToRoles];
  }

  get permissionsByRole(): Record<string, "view" | "message" | "manager"> {
    return this.props.permissionsByRole;
  }

  get lastMessage(): string | undefined {
    return this.props.lastMessage;
  }

  get unreadCount(): number {
    return this.props.unreadCount || 0;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  hasPermission(role: string, level: "view" | "message" | "manager"): boolean {
    const currentPermission = this.props.permissionsByRole[role];
    if (!currentPermission) return false;

    if (level === "view") return true;
    if (level === "message")
      return currentPermission === "message" || currentPermission === "manager";
    if (level === "manager") return currentPermission === "manager";

    return false;
  }

  public toJSON(): ChannelProps {
    return { ...this.props };
  }
}
