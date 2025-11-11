// export type UserRole = 'manager' | 'member';

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   avatar?: string;
//   role: UserRole;
//   projectIds: string[];
//   isPremium: boolean;
// }

// export interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
// }

export interface User {
  id: string;
  name: string;
  email: string;
}
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  isAuthenticated: boolean;
}
