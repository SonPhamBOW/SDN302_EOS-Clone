import express from "express";
import { createExamLog, getExamLogs } from "../controller/exam-log.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const examLogRouter = express.Router();

examLogRouter.post("/exam-logs", protectedRoute, createExamLog);
examLogRouter.get("/exam-logs/:examId/:userId", protectedRoute, getExamLogs);

export default examLogRouter;