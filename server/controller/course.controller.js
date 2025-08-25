import { Course } from "../models/Course.js";

// [POST] /api/courses
export async function createCourse(req, res) {
  try {
    const { name, course_code, description, created_by } = req.body;

    const newName = name.toUpperCase();
    const newCourseCode = course_code ? course_code.toUpperCase() : null;

    if (!name || !created_by) {
      return res.status(400).json({
        success: false,
        message: "Course name and created_by are required",
      });
    }

    if (!course_code) {
      return res.status(400).json({
        success: false,
        message: "Course code is required",
      });
    }

    // Check if course name or course code already exists
    const alreadyExistCourse = await Course.findOne({
      $or: [
        { name: newName },
        { course_code: newCourseCode }
      ]
    });

    if (alreadyExistCourse) {
      return res.status(400).json({
        success: false,
        message: "Course with this name or code already exists!",
        data: alreadyExistCourse,
      });
    }

    const course = await Course.create({ name, course_code: newCourseCode, description, created_by });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// [GET] /api/courses
export async function getAllCourses(req, res) {
  try {
    const { search, courseCode } = req.query;
    
    let query = {};
    
    // Search by course code
    if (courseCode) {
      query.course_code = courseCode.toUpperCase();
    }
    
    // Search by name or course code
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { course_code: { $regex: search, $options: 'i' } }
      ];
    }
    
    const courses = await Course.find(query).populate("created_by", "name email");
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
    const { name, course_code, description } = req.body;

    // Check if course code already exists for another course
    if (course_code) {
      const existingCourse = await Course.findOne({
        course_code: course_code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: "Course code already exists for another course"
        });
      }
    }

    const updateData = { name, description };
    if (course_code) {
      updateData.course_code = course_code.toUpperCase();
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
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
