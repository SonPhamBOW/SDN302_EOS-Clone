import { Router } from "express";
import * as courseController from "../controller/course.controller.js";
const courseRouter = Router();

courseRouter.post("/courses", courseController.createCourse);
courseRouter.get("/courses", courseController.getAllCourses);
courseRouter.get("/courses/:id", courseController.getCourseById);
courseRouter.put("/courses/:id", courseController.updateCourse);
courseRouter.delete("/courses/:id", courseController.deleteCourse);

export default courseRouter;
