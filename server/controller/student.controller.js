import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import xlsx from "xlsx";

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
 * Add student
 */
export async function addStudent(req, res) {
  isAdmin(req, res, async () => {
    try {
      const { email, password, name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const student = new User({
        email,
        password: hashedPassword,
        name,
        role: "Student",
      });
      await student.save();
      res
        .status(201)
        .json({ success: true, message: "Student added", data: student });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
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

/**
 * Import students from Excel/CSV
 */
export async function importStudents(req, res) {
  isAdmin(req, res, async () => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const students = await Promise.all(
        data.map(async (row) => {
          const hashedPassword = await bcrypt.hash(
            row.password || "123456",
            10
          );
          return User.create({
            email: row.email,
            password: hashedPassword,
            name: row.name,
            role: "Student",
          });
        })
      );

      res
        .status(201)
        .json({ success: true, message: "Students imported", data: students });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
}
