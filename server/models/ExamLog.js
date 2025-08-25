import mongoose from "mongoose";

const examLogSchema = new mongoose.Schema(
  {
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    note: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const ExamLog = mongoose.model("ExamLog", examLogSchema);
