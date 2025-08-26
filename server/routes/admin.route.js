import { Router } from "express";
import * as adminController from "../controller/admin.controller.js";
import { adminRoute } from "../middleware/auth.middleware.js";

const adminRouter = Router();

// Exam results management
adminRouter.get("/exam-results", adminRoute, adminController.getExamResults);
adminRouter.get("/exam-results/export", adminRoute, adminController.exportExamResultsExcel);
adminRouter.post("/exam-results/archive", adminRoute, adminController.archiveExamResults);

// Student management
adminRouter.get("/students", adminRoute, adminController.getAllStudent);

export default adminRouter;
