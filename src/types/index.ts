//-----------------------------------------
//        Auth
//-----------------------------------------

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
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

export type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
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

export type UserPlanList = {
  id: string;
  name: string;
  description?: string;
  price: number;
  finalAmount: number;
  features: string[];
  maxProjects: number;
  maxMembersPerProject: number;
  isCurrent: boolean;
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
  about: string | null;
  phone: string | null;
  link: string | null;
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

//---------------------------------------------------
//Tasks
//---------------------------------------------------

export type TaskStatus = "todo" | "inprogress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileKey: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  size: number;
  uploadedAt: string;
  uploadedBy: User;
}
export type assignedUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;

  assignedTo: assignedUser | null;
  createdBy: User;

  attachments: TaskAttachment[];
  isDeleted: boolean;
}

export interface AssignableMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo: string;
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface ListTasksQuery {
  projectId: string;
  status?: TaskStatus;
  assignedToMe?: boolean;
}

export interface TaskResponse {
  task: Task;
}

export interface TaskListResponse {
  tasks: Task[];
}

/* ---------- MEMBERS ---------- */

export interface SearchMembersRequest {
  projectId: string;
  query: string;
}

export interface SearchMembersResponse {
  members: AssignableMember[];
}

/* ---------- ATTACHMENTS ---------- */

export interface TaskAttachmentUploadRequest {
  taskId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface TaskAttachmentUploadResponse {
  uploadUrl: string;
  fileKey: string;
  expiresAt?: string;
}

export type TaskState = {
  tasks: Task[];
  loading: boolean;
  activeTaskId: string | null;
  activeTask: Task | null;
  error: string | null;
  isManager: boolean;
};

export type DispositionType = "view" | "download" | "task";
