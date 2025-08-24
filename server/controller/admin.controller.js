import { User } from "../models/User.js";

export async function getAllStudent(req, res, next) {
  try {
    const students = await User.find({ role: "Student" }).select("email name role avatarUrl");
    res.status(200).json({
      success: true,
      message: "Get all students success",
      students,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
