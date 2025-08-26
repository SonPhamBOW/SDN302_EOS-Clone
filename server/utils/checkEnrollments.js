import mongoose from "mongoose";
import { CourseStudent } from "../models/CourseStudent.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import dotenv from "dotenv";

dotenv.config();

async function checkEnrollments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Kiểm tra tất cả đăng ký khóa học
    const enrollments = await CourseStudent.find()
      .populate('student_id', 'name email')
      .populate('course_id', 'name course_code');

    console.log("=== ENROLLMENTS ===");
    console.log(`Total enrollments: ${enrollments.length}`);
    
    if (enrollments.length === 0) {
      console.log("No enrollments found!");
    } else {
      enrollments.forEach((enrollment, index) => {
        console.log(`${index + 1}. Student: ${enrollment.student_id?.name || 'Unknown'} (${enrollment.student_id?.email || 'No email'})`);
        console.log(`   Course: ${enrollment.course_id?.name || 'Unknown'} (${enrollment.course_id?.course_code || 'No code'})`);
        console.log(`   Enrollment ID: ${enrollment._id}`);
        console.log("---");
      });
    }

    // Kiểm tra tất cả sinh viên
    const students = await User.find({ role: 'student' });
    console.log("\n=== STUDENTS ===");
    console.log(`Total students: ${students.length}`);
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} (${student.email}) - ID: ${student._id}`);
    });

    // Kiểm tra tất cả khóa học
    const courses = await Course.find();
    console.log("\n=== COURSES ===");
    console.log(`Total courses: ${courses.length}`);
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.name} (${course.course_code}) - ID: ${course._id}`);
    });

    await mongoose.connection.close();
    console.log("\nDisconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkEnrollments();
