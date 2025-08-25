import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import * as studentExamController from "../controller/student.exam.controller.js";

const studentExamRouter = express.Router();

// USECASE 1: Xem kết quả & thống kê điểm
studentExamRouter.get("/exam-results", protectedRoute, studentExamController.getExamResults);
studentExamRouter.get("/exam-results/:examId", protectedRoute, studentExamController.getExamResultById);
studentExamRouter.get("/exam-statistics", protectedRoute, studentExamController.getExamStatistics);
studentExamRouter.get("/my-courses", protectedRoute, studentExamController.getMyCourses);
studentExamRouter.get("/course-statistics/:courseId", protectedRoute, studentExamController.getCourseStatistics);

// USECASE 2: Xem môn thi đang được mở
studentExamRouter.get("/available-exams", protectedRoute, studentExamController.getAvailableExams);
studentExamRouter.get("/course-exams/:courseId", protectedRoute, studentExamController.getCourseExams);

// USECASE 3: Làm bài thi và nộp bài
studentExamRouter.get("/take-exam/:examId", protectedRoute, studentExamController.takeExam);
studentExamRouter.post("/submit-exam/:examId", protectedRoute, studentExamController.submitExam);

export default studentExamRouter;
