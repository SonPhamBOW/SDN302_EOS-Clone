import { createExamLog, getExamLogs } from "../controller/exam-log.controller";

const examLogRouter = Router();

examLogRouter.post("/exam-logs", createExamLog);
examLogRouter.get("/exam-logs/:examId/:userId", getExamLogs);

export default examLogRouter;