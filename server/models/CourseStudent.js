import mongoose from "mongoose";

const courseStudentSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const CourseStudent = mongoose.model("CourseStudent", courseStudentSchema);
export default CourseStudent;
