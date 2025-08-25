import express from "express";
import multer from "multer";
import * as studentController from "../controller/student.controller.js";

const studentRouter = express.Router();

// Get all students
studentRouter.get("/student/list", studentController.getAllStudents);

// get student by id
studentRouter.get("/student/:id", studentController.getStudentById);

// Enroll a student into a course
studentRouter.post(
  "/courses/:courseId/enroll",
  studentController.enrollStudent
);

// Update student
studentRouter.put("/student/:id", studentController.updateStudent);

// Delete student
studentRouter.delete("/student/:id", studentController.deleteStudent);

export default studentRouter;
