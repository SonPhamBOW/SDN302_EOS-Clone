import { axiosInstance } from "../lib/axios";
import type { CoursesResponse } from "../types/Course.type";

export const getAllCourses = async (): Promise<CoursesResponse> => {
  const res = await axiosInstance.get("/courses");
  return res.data; 
};
