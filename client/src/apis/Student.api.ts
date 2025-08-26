import { axiosInstance } from "../lib/axios";
import type { SubmitExamPayload, SubmitExamResponse, TakeExamResponse } from "../types/Exam.type";

export const takeExam = async (examId: string): Promise<TakeExamResponse> => {
  const res = await axiosInstance.get(`/take-exam/${examId}`);
  return res.data as TakeExamResponse;
};

export const submitExam = async (
  examId: string,
  payload: SubmitExamPayload
): Promise<SubmitExamResponse> => {
  const res = await axiosInstance.post(`/submit-exam/${examId}`, payload);
  return res.data as SubmitExamResponse;
};

export const logExamEvent = async (examId: string, note: string): Promise<void> => {
  await axiosInstance.post(`/exam-logs`, { examId, note });
};

export type ExamResultItem = {
  _id: string;
  exam_id: {
    _id: string;
    name: string;
    start_time?: string;
    end_time?: string;
  };
  course_id?: { _id: string; name: string };
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  submitted_at?: string;
};

export type ScoreDistribution = {
  excellent: number;
  good: number;
  average: number;
  below_average: number;
};

export type CoursePerformance = {
  _id: string;
  course_name?: string | string[];
  exam_count: number;
  average_score: number;
  total_questions: number;
  total_correct: number;
};

export type ExamStatistics = {
  total_exams: number;
  average_score: number;
  total_questions: number;
  total_correct: number;
  total_wrong: number;
  accuracy_rate: number;
  score_distribution: ScoreDistribution;
  course_performance: CoursePerformance[];
};

export type AvailableExam = {
  _id: string;
  name: string;
  start_time: string;
  end_time: string;
  course_id?: { _id: string; name: string; course_code: string };
  total_questions?: number;
  status: "upcoming" | "ongoing" | "completed";
  canAccess: boolean;
};

export type MyCourse = { _id: string; name: string; course_code?: string };

export const getMyExamResults = async (): Promise<ExamResultItem[]> => {
  const res = await axiosInstance.get("/exam-results");
  return res.data.data;
};

export const getMyExamResultById = async (
  examId: string
): Promise<ExamResultItem> => {
  const res = await axiosInstance.get(`/exam-results/${examId}`);
  return res.data.data;
};

export const getMyExamStatistics = async (): Promise<ExamStatistics> => {
  const res = await axiosInstance.get("/exam-statistics");
  return res.data.data;
};

export const getAvailableExams = async (
  search?: string,
  courseCode?: string
): Promise<AvailableExam[]> => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (courseCode) params.append("courseCode", courseCode);

  const res = await axiosInstance.get(`/available-exams?${params.toString()}`);
  return res.data.data;
};

export const getCourseExams = async (
  courseId: string
): Promise<AvailableExam[]> => {
  const res = await axiosInstance.get(`/course-exams/${courseId}`);
  return res.data.data;
};

export const getMyCourses = async (): Promise<MyCourse[]> => {
  const res = await axiosInstance.get("/my-courses");
  return res.data.data;
};

export const getAllStudents = async () => {
  const res = await axiosInstance.get("/student/list");
  return res.data;
};

export const deleteStudent = async (id: string) => {
  const res = await axiosInstance.delete(`/student/${id}`);
  return res.data;
};

export const updateStudent = async ({
  id,
  name,
  isVerified,
}: {
  id: string;
  name: string;
  isVerified: boolean;
}) => {
  const res = await axiosInstance.put(`/student/${id}`, { name, isVerified });
  return res.data;
};

export type CourseShort = {
  _id: string;
  name: string;
  course_code?: string | null;
  description?: string | null;
};

export type StudentDetails = {
  name: string;
  email: string;
  lastLogin?: string | null; // ISO string from backend
  isVerified: boolean;
  courses: CourseShort[];
};

export const getStudentById = async (
  id: string
): Promise<{ success: boolean; data: StudentDetails }> => {
  const res = await axiosInstance.get(`/student/${id}`);
  return res.data;
};
