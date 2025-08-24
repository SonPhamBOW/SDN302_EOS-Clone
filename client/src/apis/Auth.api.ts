import { axiosInstance } from "../lib/axios";
import type { RegisterType, UserSignInType, UserType } from "../types/User.type";

export const signUp = async (signUpData: RegisterType) => {
  const res = await axiosInstance.post("/auth/signup", signUpData);
  return res.data;
};

export const signIn = async (signInData: UserSignInType) => {
  const res = await axiosInstance.post("/auth/signin", signInData);
  return res.data;
};

export const signOut = async () => {
  const res = await axiosInstance.post("/auth/signout");
  return res.data;
};

export const getMe = async (): Promise<UserType> => {
  const res = await axiosInstance.get("/auth/get-me");
  return res.data;
};