import mongoose from "mongoose";
import { Question } from "../models/Question.js";

export async function getQuestions(req, res, next) {
  try {
    const { course_id } = req.query;

    const questions = await Question.find({
      course_id: course_id,
    })
      .populate("course_id", "name")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function createQuestion(req, res, next) {
  try {
    const { course_id, type, content, imageUrl, answers, createdBy } = req.body;

    if (!course_id || !type || !content || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "course_id, type, content and createdBy are required",
      });
    }

    const question = await Question.create({
      course_id,
      type,
      content,
      imageUrl,
      answers,
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully!",
      data: question,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function createManyQuestion(req, res, next) {
  try {
    const questions = req.body; 

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array of questions",
      });
    }

    for (const q of questions) {
      if (!q.course_id || !q.type || !q.content || !q.createdBy) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must have course_id, type, content and createdBy",
        });
      }
    }

    const insertedQuestions = await Question.insertMany(questions);

    res.status(201).json({
      success: true,
      message: "Questions created successfully!",
      data: insertedQuestions,
    });
  } catch (error) {
    console.error("Error creating questions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function updateQuestion(req, res) {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: question,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
