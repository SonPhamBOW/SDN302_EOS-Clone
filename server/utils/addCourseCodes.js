import { connectDB } from "../lib/database.js";
import { Course } from "../models/Course.js";

// Sample course codes mapping - you can modify this based on your actual courses
const courseCodeMapping = {
  "TRIẾT HỌC MÁC - LÊNIN": "MLN111",
  "KINH TẾ CHÍNH TRỊ MÁC - LÊNIN": "MLN112", 
  "CHỦ NGHĨA XÃ HỘI KHOA HỌC": "MLN113",
  "LỊCH SỬ ĐẢNG CỘNG SẢN VIỆT NAM": "MLN114",
  "TƯ TƯỞNG HỒ CHÍ MINH": "MLN115",
  "TOÁN CAO CẤP": "MTH101",
  "VẬT LÝ ĐẠI CƯƠNG": "PHY101",
  "HÓA HỌC ĐẠI CƯƠNG": "CHE101",
  "SINH HỌC ĐẠI CƯƠNG": "BIO101",
  "TIN HỌC ĐẠI CƯƠNG": "CSE101",
  "LẬP TRÌNH CƠ BẢN": "CSE102",
  "CƠ SỞ DỮ LIỆU": "CSE201",
  "MẠNG MÁY TÍNH": "CSE202",
  "LẬP TRÌNH WEB": "CSE203",
  "TIẾNG ANH CƠ BẢN": "ENG101",
  "TIẾNG ANH CHUYÊN NGÀNH": "ENG201"
};

async function addCourseCodes() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Get all courses without course_code
    const coursesWithoutCode = await Course.find({ course_code: { $exists: false } });
    console.log(`Found ${coursesWithoutCode.length} courses without course codes`);

    for (const course of coursesWithoutCode) {
      const courseName = course.name.toUpperCase();
      let courseCode = courseCodeMapping[courseName];
      
      // If no mapping found, generate a default code
      if (!courseCode) {
        courseCode = `COURSE${course._id.toString().slice(-4).toUpperCase()}`;
      }

      try {
        await Course.findByIdAndUpdate(course._id, { course_code: courseCode });
        console.log(`Updated course "${course.name}" with code: ${courseCode}`);
      } catch (error) {
        console.error(`Error updating course "${course.name}":`, error.message);
      }
    }

    console.log("Course code update completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

addCourseCodes();
