import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import * as studentExamController from "../controller/student.exam.controller.js";

const studentExamRouter = express.Router();

// USECASE 1: Xem kết quả & thống kê điểm
studentExamRouter.get("/student/exam-results", protectedRoute, studentExamController.getExamResults);
studentExamRouter.get("/student/exam-results/:examId", protectedRoute, studentExamController.getExamResultById);
studentExamRouter.get("/student/exam-statistics", protectedRoute, studentExamController.getExamStatistics);

// USECASE 2: Xem môn thi đang được mở
studentExamRouter.get("/student/available-exams", protectedRoute, studentExamController.getAvailableExams);
studentExamRouter.get("/student/course-exams/:courseId", protectedRoute, studentExamController.getCourseExams);

// USECASE 3: Làm bài thi và nộp bài
studentExamRouter.get("/student/take-exam/:examId", protectedRoute, studentExamController.takeExam);
studentExamRouter.post("/student/submit-exam/:examId", protectedRoute, studentExamController.submitExam);

export default studentExamRouter;
