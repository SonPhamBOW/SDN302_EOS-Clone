export interface Question {
  _id: string;
  text: string;
  options: { text: string; isCorrect: boolean }[];
  course_id: { _id: string; name: string };
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface QuestionsResponse {
  success: boolean;
  data: Question[];
}

export interface AnswerInput {
  content: string;
  isCorrect?: boolean; // optional vì default = false
}

export type QuestionType = "mcq" | "essay" | "true_false";

export interface QuestionInput {
  course_id: string; // ObjectId dạng string
  type: QuestionType;
  content: string;
  imageUrl?: string[];
  answers?: AnswerInput[];
  createdBy: string; // ObjectId dạng string
}