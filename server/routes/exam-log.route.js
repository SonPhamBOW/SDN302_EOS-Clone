import express from "express";
import { createExamLog, getExamLogs } from "../controller/exam-log.controller.js";

const examLogRouter = express.Router();

examLogRouter.post("/exam-logs", createExamLog);
examLogRouter.get("/exam-logs/:examId/:userId", getExamLogs);

export default examLogRouter;