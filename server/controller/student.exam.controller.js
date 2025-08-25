import { ExamResult } from "../models/ExamResult.js";
import { Exam } from "../models/Exam.js";
import { Course } from "../models/Course.js";
import { Question } from "../models/Question.js";
import mongoose from "mongoose";
import { getRandomQuestions } from "../utils/getRandomQuestionsForExam.js";

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

export async function takeExam(req, res) {
  try {
    const {examId} = req.params;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
    
    const randomQuestions = await getRandomQuestions(examId, exam.total_questions);
    
    res.status(200).json({
      success: true,
      message: "Exam taken successfully",
      data: {
        ...exam,
        questions: randomQuestions,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * USECASE 3: Nộp bài thi và tính điểm
 * Submit exam answers and calculate score
 */
export async function submitExam(req, res) {
  try {
    const { examId } = req.params;
    const { answers, timeTaken } = req.body; // answers: [{question_id, student_answer}]
    const studentId = req.user.id;
    
    // Validation
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers are required and must be an array"
      });
    }
    
    // Kiểm tra exam có tồn tại và còn trong thời gian làm bài
    const exam = await Exam.findById(examId).populate('course_id', 'name');
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }
    
    const currentTime = new Date();
    if (currentTime < exam.start_time || currentTime > exam.end_time) {
      return res.status(400).json({
        success: false,
        message: "Exam is not available at this time"
      });
    }
    
    // Kiểm tra xem học sinh đã nộp bài này chưa
    const existingResult = await ExamResult.findOne({
      student_id: studentId,
      exam_id: examId
    });
    
    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this exam"
      });
    }
    
    // Lấy thông tin các câu hỏi để tính điểm
    const questionIds = answers.map(answer => answer.question_id);
    const questions = await Question.find({
      _id: { $in: questionIds }
    });
    
    if (questions.length !== answers.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid questions in answers"
      });
    }
    
    // Tính điểm
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const processedAnswers = [];
    
    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.question_id);
      if (!question) continue;
      
      // Tìm đáp án đúng
      const correctAnswer = question.answers.find(ans => ans.isCorrect);
      const isCorrect = correctAnswer && correctAnswer.content === answer.student_answer;
      
      if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
      
      processedAnswers.push({
        question_id: answer.question_id,
        student_answer: answer.student_answer,
        is_correct: isCorrect,
        correct_answer: correctAnswer ? correctAnswer.content : ""
      });
    }
    
    // Tính điểm số (thang điểm 100)
    const totalQuestions = answers.length;
    const score = (correctAnswers / totalQuestions) * 100;
    
    // Lưu kết quả thi
    const examResult = new ExamResult({
      student_id: studentId,
      exam_id: examId,
      course_id: exam.course_id._id,
      score: Math.round(score * 100) / 100, // Làm tròn 2 chữ số thập phân
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      wrong_answers: wrongAnswers,
      time_taken: timeTaken || 0, // Thời gian làm bài (phút)
      answers: processedAnswers
    });
    
    await examResult.save();
    
    // Populate thông tin để trả về
    await examResult.populate([
      { path: 'exam_id', select: 'name start_time end_time' },
      { path: 'course_id', select: 'name' },
      { path: 'answers.question_id', select: 'content type' }
    ]);
    
    res.status(201).json({
      success: true,
      message: "Exam submitted successfully",
      data: {
        result: examResult,
        summary: {
          score: examResult.score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          accuracy_rate: Math.round((correctAnswers / totalQuestions) * 100 * 100) / 100,
          time_taken: timeTaken,
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}