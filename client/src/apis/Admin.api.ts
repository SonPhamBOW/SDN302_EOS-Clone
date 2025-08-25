import { axiosInstance } from "../lib/axios";
import type { CoursesResponse } from "../types/Course.type";

export const getAllCourses = async (): Promise<CoursesResponse> => {
  const res = await axiosInstance.get("/courses");
  return res.data; 
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

export async function adminListExamResults(params?: { courseId?: string; studentId?: string; archived?: boolean }) {
	const res = await axiosInstance.get("/admin/exam-results", { params });
	return res.data.data as AdminExamResult[];
}

export async function adminExportExamResults(params?: { courseId?: string; studentId?: string; archived?: boolean }) {
	const res = await axiosInstance.get("/admin/exam-results/export", { params, responseType: "blob" });
	return res.data as Blob;
}

export async function adminArchiveExamResults(body: { resultIds: string[]; archived: boolean }) {
	const res = await axiosInstance.post("/admin/exam-results/archive", body);
	return res.data as { success: boolean; matched: number; modified: number };
}