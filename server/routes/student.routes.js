import express from "express";
import * as studentController from "../controller/student.controller.js";
import { adminRoute } from "../middleware/auth.middleware.js";

const studentRouter = express.Router();

// Apply admin middleware to all routes
studentRouter.use(adminRoute);

// Get all students
studentRouter.get("/list", studentController.getAllStudents);

// Search students by name
studentRouter.get("/search", studentController.searchStudents);

// Get a single student by ID
studentRouter.get("/:id", studentController.getStudentById);

// Enroll a student into a course
studentRouter.post(
  "/courses/:courseId/enroll",
  studentController.enrollStudent
);

// Update a student
studentRouter.put("/:id", studentController.updateStudent);

// Delete a student
studentRouter.delete("/:id", studentController.deleteStudent);

export default studentRouter;
