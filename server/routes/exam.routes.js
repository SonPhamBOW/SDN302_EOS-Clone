import { Router } from "express";
import * as examController from "../controller/exam.controller.js";
import { adminRoute } from "../middleware/auth.middleware.js";
const examRouter = Router();

examRouter.use("/exams", adminRoute);

examRouter.get("/exams");

examRouter.post("/exams", examController.createNewExam);
examRouter.put("/exams", examController.updateExam);

examRouter.delete("/exams");

export default examRouter;
