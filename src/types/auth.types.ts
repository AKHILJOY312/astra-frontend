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
