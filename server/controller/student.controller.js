import { User } from "../models/User.js";
import CourseStudent from "../models/CourseStudent.js";
/**
 * Middleware inside controller file
 */
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "Admin") {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, message: "Access denied: Admins only" });
}

// Get all students
export async function getAllStudents(req, res) {
  try {
    const students = await User.find({ role: "Student" }).select("-password");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Enroll student
 */

export async function enrollStudent(req, res) {
  try {
    const { courseId } = req.params; // from URL
    const { studentId } = req.body; // from request body

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
    const enrollment = new CourseStudent({
      course_id: courseId,
      student_id: studentId,
    });
    await enrollment.save();

    res.status(201).json({
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Update student
 */
export async function updateStudent(req, res) {
  isAdmin(req, res, async () => {
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
  });
}

/**
 * Delete student
 */
export async function deleteStudent(req, res) {
  isAdmin(req, res, async () => {
    try {
      const { id } = req.params;
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "Student not found" });
      res.status(200).json({ success: true, message: "Student deleted" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
}

// Get student info by ID (and enrolled courses)
export async function getStudentById(req, res) {
  try {
    const { id } = req.params;

    const enrollments = await CourseStudent.find({ student_id: id })
      .populate("course_id", "name description") // include course info
      .populate("student_id", "name email"); // include student info

    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "Student not found or not enrolled in any course" });
    }

    res.status(200).json(enrollments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching student", error: err.message });
  }
}

export async function searchStudents(req, res) {
  try {
    const { search } = req.query;

    if (!search)
      return res.status(400).json({ message: "Search query is required" });

    const students = await User.find({
      role: "Student",
      name: { $regex: search, $options: "i" },
    })
      .select("-password")
      .limit(20);

    // Return empty array if no students found
    res.status(200).json({ success: true, data: students || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
