import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
    },
    course_code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true } 
);

export const Course = mongoose.model("Course", courseSchema);
