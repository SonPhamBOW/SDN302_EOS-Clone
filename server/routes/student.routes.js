import express from "express";
// import multer from "multer";
import * as studentController from "../controller/student.controller.js";

const studentRouter = express.Router();
// const upload = multer({ dest: "uploads/" });

// Get all students
studentRouter.get("/student/", studentController.getAllStudents);

// Add student
studentRouter.post("/student/", studentController.addStudent);

// Update student
studentRouter.put("/student/:id", studentController.updateStudent);

// Delete student
studentRouter.delete("/student/:id", studentController.deleteStudent);

// Import students from Excel/CSV
// studentRouter.post(
//   "/student/import",
//   upload.single("file"),
//   studentController.importStudents
// );

export default studentRouter;
