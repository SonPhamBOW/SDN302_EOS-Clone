export type QuestionType = "mcq" | "essay" | "true_false";

export type AnswerOption = {
  _id: string;
  content: string;
  // The correctness flag is not needed on client during test; keep optional
  isCorrect?: boolean;
};

export type Question = {
  _id: string;
  course_id?: string;
  type: QuestionType;
  content: string;
  imageUrl?: string[];
  answers: AnswerOption[];
};

export type ExamData = {
  _id: string;
  course_id: string;
  name: string;
  duration: number; // minutes
  total_questions: number;
  start_time?: string;
  end_time?: string;
  questions: Question[];
};

export type TakeExamResponse = {
  success: boolean;
  message: string;
  data: ExamData;
};

export type SubmitExamPayload = {
  answers: Array<{
    question_id: string;
    student_answer: string | null;
  }>;
  timeTaken: number; // minutes
};

export type SubmitExamResponse = {
  success: boolean;
  message: string;
  data: {
    result: unknown;
    summary: {
      score: number;
      total_questions: number;
      correct_answers: number;
      wrong_answers: number;
      accuracy_rate: number;
      time_taken: number;
    };
  };
};


