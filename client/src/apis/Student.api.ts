import { axiosInstance } from "../lib/axios";
import type { SubmitExamPayload, SubmitExamResponse, TakeExamResponse } from "../types/Exam.type";

export const takeExam = async (examId: string): Promise<TakeExamResponse> => {
  const res = await axiosInstance.get(`/student/take-exam/${examId}`);
  return res.data as TakeExamResponse;
};

export const submitExam = async (
  examId: string,
  payload: SubmitExamPayload
): Promise<SubmitExamResponse> => {
  const res = await axiosInstance.post(`/student/submit-exam/${examId}`, payload);
  return res.data as SubmitExamResponse;
};


