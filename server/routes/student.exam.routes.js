import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import * as studentExamController from "../controller/student.exam.controller.js";

const studentExamRouter = express.Router();

studentExamRouter.get("/exam-results", protectedRoute, studentExamController.getExamResults);
studentExamRouter.get("/exam-results/:examId", protectedRoute, studentExamController.getExamResultById);
studentExamRouter.get("/exam-statistics", protectedRoute, studentExamController.getExamStatistics);
studentExamRouter.get("/my-courses", protectedRoute, studentExamController.getMyCourses);
studentExamRouter.get("/course-statistics/:courseId", protectedRoute, studentExamController.getCourseStatistics);
studentExamRouter.get("/available-exams", protectedRoute, studentExamController.getAvailableExams);
studentExamRouter.get("/course-exams/:courseId", protectedRoute, studentExamController.getCourseExams);
studentExamRouter.get("/take-exam/:examId", protectedRoute, studentExamController.takeExam);
studentExamRouter.post("/submit-exam/:examId", protectedRoute, studentExamController.submitExam);

export default studentExamRouter;
