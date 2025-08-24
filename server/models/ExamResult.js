import mongoose from "mongoose";

const examResultSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    total_questions: {
      type: Number,
      required: true,
    },
    correct_answers: {
      type: Number,
      required: true,
      min: 0,
    },
    wrong_answers: {
      type: Number,
      required: true,
      min: 0,
    },
    time_taken: {
      type: Number, // in minutes
      required: true,
    },
    submitted_at: {
      type: Date,
      default: Date.now,
    },
    answers: [
      {
        question_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        student_answer: String,
        is_correct: Boolean,
        correct_answer: String,
      },
    ],
  },
  { timestamps: true }
);

// Index để tối ưu query
examResultSchema.index({ student_id: 1, exam_id: 1 });
examResultSchema.index({ course_id: 1 });

export const ExamResult = mongoose.model("ExamResult", examResultSchema);
