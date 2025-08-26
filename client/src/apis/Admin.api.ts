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

export const deleteCourse = async (id: string) => {
  const res = await axiosInstance.delete(`/courses/${id}`);
  return res.data;
};

export const updateCourse = async ({
  id,
  name,
  description,
  course_code,
}: {
  id: string;
  name: string;
  description: string;
  course_code?: string; // optional
}) => {
  const body: any = { name, description };
  if (course_code) body.course_code = course_code; // only send if filled

  const res = await axiosInstance.put(`/courses/${id}`, body);
  return res.data;
};

export const createCourse = async ({
  name,
  description,
  course_code,
  created_by,
}: {
  name: string;
  description: string;
  course_code?: string;
  created_by: string; // user id of admin creating
}) => {
  const body: any = { name, description, created_by };
  if (course_code) body.course_code = course_code;

  const res = await axiosInstance.post("/courses", body);
  return res.data;
};

export const enrollStudent = async ({
  courseId,
  studentId,
}: {
  courseId: string;
  studentId: string;
}) => {
  const res = await axiosInstance.post(`/student/courses/${courseId}/enroll`, {
    studentId,
  });
  return res.data;
};

export const searchStudents = async (query: string) => {
  const res = await axiosInstance.get(
    `/student/search?search=${encodeURIComponent(query)}`
  );
  return res.data.data;
};

export type AdminExamResult = {
  _id: string;
  student_id?: { _id: string; name: string; email: string };
  course_id?: { _id: string; name: string };
  exam_id?: { _id: string; name: string };
  score: number;
  correct_answers: number;
  wrong_answers: number;
  total_questions: number;
  archived?: boolean;
  submitted_at?: string;
};

export async function adminListExamResults(params?: {
  courseId?: string;
  studentId?: string;
  archived?: boolean;
}) {
  const res = await axiosInstance.get("/admin/exam-results", { params });
  return res.data.data as AdminExamResult[];
}

export async function adminExportExamResults(params?: {
  courseId?: string;
  studentId?: string;
  archived?: boolean;
}) {
  const res = await axiosInstance.get("/admin/exam-results/export", {
    params,
    responseType: "blob",
  });
  return res.data as Blob;
}

export async function adminArchiveExamResults(body: {
  resultIds: string[];
  archived: boolean;
}) {
  const res = await axiosInstance.post("/admin/exam-results/archive", body);
  return res.data as { success: boolean; matched: number; modified: number };
}
