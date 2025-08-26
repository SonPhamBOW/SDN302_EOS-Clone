export interface UserSignInType {
  email: string;
  password: string;
}

export interface RegisterType {
  email: string;
  password: string;
  name: string;
}

export interface UserType {
  success: boolean;
  user: {
    _id: string
    avatarUrl: string;
    email: string;
    name: string;
    role: string;
  };
}
