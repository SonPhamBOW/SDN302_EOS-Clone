import {Course} from "../models/Course.js";

// [POST] /api/courses
export async function createCourse(req, res) {
  try {
    const { name, description, created_by } = req.body;

    if (!name || !created_by) {
      return res.status(400).json({
        success: false,
        message: "Course name and created_by are required",
      });
    }

    const course = await Course.create({ name, description, created_by });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Course name already exists",
      });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
}

// [GET] /api/courses
export async function getAllCourses(req, res) {
  try {
    const courses = await Course.find().populate("created_by", "name email");
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// [GET] /api/courses/:id
export async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id).populate(
      "created_by",
      "name email"
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid ID format" });
  }
}

// [PUT] /api/courses/:id
export async function updateCourse(req, res) {
  try {
    const { name, description } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

// [DELETE] /api/courses/:id
export async function deleteCourse(req, res) {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid ID format" });
  }
}
