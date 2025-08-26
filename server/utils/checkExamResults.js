import { connectDB } from "../lib/database.js";
import { ExamResult } from "../models/ExamResult.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Exam } from "../models/Exam.js";

async function checkExamResults() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Check if we have exam results
    const results = await ExamResult.find({}).populate('student_id course_id exam_id');
    console.log(`\n=== Exam Results Count: ${results.length} ===`);
    
    if (results.length === 0) {
      console.log("No exam results found. Creating sample data...");
      
      // Get a student
      const student = await User.findOne({ role: "Student" });
      if (!student) {
        console.log("No student found. Please create a student first.");
        return;
      }
      
      // Get a course
      const course = await Course.findOne({});
      if (!course) {
        console.log("No course found. Please create a course first.");
        return;
      }
      
      // Get an exam
      const exam = await Exam.findOne({});
      if (!exam) {
        console.log("No exam found. Please create an exam first.");
        return;
      }
      
      // Create sample exam result
      const sampleResult = new ExamResult({
        student_id: student._id,
        exam_id: exam._id,
        course_id: course._id,
        score: 85.5,
        total_questions: 10,
        correct_answers: 8,
        wrong_answers: 2,
        time_taken: 45,
        answers: [],
        archived: false
      });
      
      await sampleResult.save();
      console.log("Created sample exam result:", sampleResult._id);
    } else {
      console.log("Existing exam results:");
      results.forEach((result, index) => {
        console.log(`${index + 1}. Student: ${result.student_id?.name || 'Unknown'}`);
        console.log(`   Course: ${result.course_id?.name || 'Unknown'}`);
        console.log(`   Exam: ${result.exam_id?.name || 'Unknown'}`);
        console.log(`   Score: ${result.score}`);
        console.log(`   Archived: ${result.archived ? 'Yes' : 'No'}`);
        console.log("---");
      });
    }

    console.log("\nCheck completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkExamResults();
