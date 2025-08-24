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

export default studentExamRouter;
