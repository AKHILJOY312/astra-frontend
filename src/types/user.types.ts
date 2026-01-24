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
