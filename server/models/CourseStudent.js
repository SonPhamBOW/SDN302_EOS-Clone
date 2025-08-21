const mongoose = require("mongoose");

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

courseStudentSchema.index({ course_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model("CourseStudent", courseStudentSchema);
