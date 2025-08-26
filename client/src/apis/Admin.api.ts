import { axiosInstance } from "../lib/axios";
import type { CoursesResponse } from "../types/Course.type";
import type { QuestionInput, QuestionsResponse } from "../types/Question.type";

export const getAllCourses = async (): Promise<CoursesResponse> => {
  const res = await axiosInstance.get("/courses");
  return res.data;
};

export const getQuestionsByCourse = async (
  course_id: string
): Promise<QuestionsResponse> => {
  const res = await axiosInstance.get("/questions", {
    params: { course_id },
  });
  return res.data;
};

export const createManyQuestion = async (data: QuestionInput[]) => {
  try {
    const res = await axiosInstance.post("/questions-many", data);
    return res.data;
  } catch (error: any) {
    console.error("Error creating questions:", error);
    throw error.response?.data || { message: "Network Error" };
  }
};

export const updateQuestion = async ({ questionId, data }) => {
  try {
    const res = await axiosInstance.put(`/questions/${questionId}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating questions:", error);
    throw error.response?.data || { message: "Network Error" };
  }
};
