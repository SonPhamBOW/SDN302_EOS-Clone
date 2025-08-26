import { User } from "../models/User.js";
import { CourseStudent } from "../models/CourseStudent.js";
import mongoose from "mongoose";
// Get all students
export async function getAllStudents(req, res) {
  try {
    const students = await User.find({ role: "Student" }).select("-password");
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Enroll student
 */

export async function enrollStudent(req, res) {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Prevent duplicate enrollment
    const existing = await CourseStudent.findOne({
      course_id: courseId,
      student_id: studentId,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Student is already enrolled in this course" });
    }

    // Create enrollment record
    const enrollment = await CourseStudent.create({
      course_id: courseId,
      student_id: studentId,
    });

    res.status(201).json({
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * Update student
 */
export async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const updated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    res
      .status(200)
      .json({ success: true, message: "Student updated", data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * Delete student
 */
export async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Get student info by ID (and enrolled courses)
export async function getStudentById(req, res) {
  try {
    const { id } = req.params;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student id" });
    }

    // 1) fetch student basic info
    const student = await User.findById(id).select(
      "name email lastLogin isVerified"
    );
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // 2) fetch enrollments and populate course info
    const enrollments = await CourseStudent.find({ student_id: id }).populate(
      "course_id",
      "name course_code description"
    );

    // map courses (filter nulls if a course was removed)
    const courses = enrollments
      .map((e) => e.course_id)
      .filter((c) => !!c)
      .map((c) => ({
        _id: c._id,
        name: c.name,
        course_code: c.course_code,
        description: c.description,
      }));

    const result = {
      name: student.name,
      email: student.email,
      lastLogin: student.lastLogin,
      isVerified: student.isVerified,
      courses,
    };

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("getStudentById error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}

export async function searchStudents(req, res) {
  try {
    const { search } = req.query;

    if (!search)
      return res.status(400).json({ message: "Search query is required" });

    const regex = new RegExp(search, "i");

    const students = await User.find({
      role: "Student",
      name: { $regex: regex },
    })
      .select("-password")
      .limit(20);

    // Return empty array if no students found
    res.status(200).json({ success: true, data: students || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
