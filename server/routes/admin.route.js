import { Router } from "express";
import * as adminController from "../controller/admin.controller.js";
import { adminRoute } from "../middleware/auth.middleware.js";

const adminRouter = Router();

adminRouter.get("/exam-results/export", adminRoute, adminController.exportExamResultsExcel);

adminRouter.get("/students", adminRoute, adminController.getAllStudent);

export default adminRouter;
