//-----------------------------------------
//        Auth
//-----------------------------------------

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export type UserModal = User & {
  isBlocked: boolean;
  createdAt: Date | undefined;
  isVerified: boolean;
  status: "active" | "blocked";
  image: string | null;
};

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  isAuthenticated: boolean;
  role: "user" | "admin" | null;
};

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

//-----------------------------------------
//        Plan
//-----------------------------------------

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  finalAmount: number;
  currency: "INR" | "USD" | "EUR";
  billingCycle: "monthly" | "yearly";
  features: string[];
  maxProjects: number;
  maxMembersPerProject: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

//-----------------------------------------
//        UserSubscription
//-----------------------------------------
export type VerifyPayment = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};
//-----------------------------------------
//        User
//-----------------------------------------
export type IProfilePlan = {
  planType: string;
  amount: number;
  currency: string;
  status: string;
  endDate: Date;
};

export type IUserProfile = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  isVerified: boolean;
  createdAt: Date;
  plan: IProfilePlan | null;
};

export type UserResponse = {
  id?: string;
  _id?: string;

  name: string;
  email: string;

  isAdmin: boolean;
  isVerified: boolean;

  status: "active" | "blocked";
  image?: string | null;

  createdAt: Date | undefined;
};

//-----------------------------------------
//        Project
//-----------------------------------------

export type Project = {
  id: string;
  projectName: string;
  description: string;
  imageUrl: string | null;
  ownerId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

type Members = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  role: "manager" | "lead" | "member";
};

export type ProjectState = {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  search: string;
  members: Members[];
  membersLoading: boolean;
  membersError: string | null;

  limits: {
    maxProjects: number;
    maxMembersPerProject: number;
    currentProjects: number;
    planName: string;
  } | null;
  currentPlan: Plan | null;
};

//-----------------------------------------
//        Messages
//-----------------------------------------

export type Message = {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  text: string;
  hasAttachments: boolean;
  hasReplies: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MessagesState = {
  activeChannelId: string | null;
  list: Message[];
};
