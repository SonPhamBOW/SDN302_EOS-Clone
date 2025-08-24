import { ExamResult } from "../models/ExamResult.js";
import { Exam } from "../models/Exam.js";
import { Course } from "../models/Course.js";
import mongoose from "mongoose";

/**
 * USECASE 1: Xem kết quả & thống kê điểm
 * Get exam results for a student
 */
export async function getExamResults(req, res) {
  try {
    const studentId = req.user.id; // Lấy từ middleware auth
    
    const results = await ExamResult.find({ student_id: studentId })
      .populate('exam_id', 'name start_time end_time')
      .populate('course_id', 'name')
      .sort({ submitted_at: -1 });
    
    res.status(200).json({ 
      success: true, 
      data: results 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

/**
 * Get specific exam result by ID
 */
export async function getExamResultById(req, res) {
  try {
    const { examId } = req.params;
    const studentId = req.user.id;
    
    const result = await ExamResult.findOne({ 
      exam_id: examId, 
      student_id: studentId 
    })
    .populate('exam_id', 'name start_time end_time total_questions')
    .populate('course_id', 'name')
    .populate('answers.question_id', 'question_text options');
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: "Exam result not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

/**
 * Get exam statistics for a student
 */
export async function getExamStatistics(req, res) {
  try {
    const studentId = req.user.id;
    
    // Lấy tất cả kết quả thi
    const results = await ExamResult.find({ student_id: studentId });
    
    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          total_exams: 0,
          average_score: 0,
          total_questions: 0,
          total_correct: 0,
          total_wrong: 0,
          accuracy_rate: 0,
          score_distribution: [],
          course_performance: []
        }
      });
    }
    
    // Tính toán thống kê
    const totalExams = results.length;
    const totalQuestions = results.reduce((sum, result) => sum + result.total_questions, 0);
    const totalCorrect = results.reduce((sum, result) => sum + result.correct_answers, 0);
    const totalWrong = results.reduce((sum, result) => sum + result.wrong_answers, 0);
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / totalExams;
    const accuracyRate = (totalCorrect / totalQuestions) * 100;
    
    // Phân bố điểm
    const scoreDistribution = {
      excellent: results.filter(r => r.score >= 90).length,
      good: results.filter(r => r.score >= 80 && r.score < 90).length,
      average: results.filter(r => r.score >= 70 && r.score < 80).length,
      below_average: results.filter(r => r.score < 70).length
    };
    
    // Hiệu suất theo môn học
    const courseStats = await ExamResult.aggregate([
      { $match: { student_id: new mongoose.Types.ObjectId(studentId) } },
      {
        $lookup: {
          from: "courses",
          localField: "course_id",
          foreignField: "_id",
          as: "course"
        }
      },
      {
        $group: {
          _id: "$course_id",
          course_name: { $first: "$course.name" },
          exam_count: { $sum: 1 },
          average_score: { $avg: "$score" },
          total_questions: { $sum: "$total_questions" },
          total_correct: { $sum: "$correct_answers" }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total_exams: totalExams,
        average_score: Math.round(averageScore * 100) / 100,
        total_questions: totalQuestions,
        total_correct: totalCorrect,
        total_wrong: totalWrong,
        accuracy_rate: Math.round(accuracyRate * 100) / 100,
        score_distribution: scoreDistribution,
        course_performance: courseStats
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

/**
 * USECASE 2: Xem môn thi đang được mở
 * Get available exams for registration
 */
export async function getAvailableExams(req, res) {
  try {
    const currentTime = new Date();
    
    // Lấy các kỳ thi đang mở (start_time <= now <= end_time)
    const availableExams = await Exam.find({
      start_time: { $lte: currentTime },
      end_time: { $gte: currentTime }
    })
    .populate('course_id', 'name description')
    .select('-questions') // Không trả về câu hỏi
    .sort({ start_time: 1 });
    
    res.status(200).json({
      success: true,
      data: availableExams
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

/**
 * Get exams for a specific course
 */
export async function getCourseExams(req, res) {
  try {
    const { courseId } = req.params;
    const currentTime = new Date();
    
    // Kiểm tra course có tồn tại không
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    // Lấy các kỳ thi của môn học này
    const exams = await Exam.find({
      course_id: courseId
    })
    .populate('course_id', 'name description')
    .select('-questions')
    .sort({ start_time: 1 });
    
    // Phân loại theo trạng thái
    const examStatus = exams.map(exam => {
      const now = new Date();
      let status = 'upcoming';
      
      if (now >= exam.start_time && now <= exam.end_time) {
        status = 'ongoing';
      } else if (now > exam.end_time) {
        status = 'completed';
      }
      
      return {
        ...exam.toObject(),
        status: status
      };
    });
    
    res.status(200).json({
      success: true,
      data: {
        course: course,
        exams: examStatus
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}
