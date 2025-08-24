import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true } 
);

const questionSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", 
      required: true,
    },
    type: {
      type: String,
      enum: ["mcq", "essay", "true_false"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: [
      {
        type: String, 
      },
    ],
    answers: [answerSchema], 
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true } 
);

export const Question = mongoose.model("Question", questionSchema);
