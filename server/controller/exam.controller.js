import { Exam } from "../models/Exam.js";
import { getRandomQuestions } from "../utils/getRandomQuestionsForExam.js";
import { shuffleQuestions } from "../utils/shuffleQuestions.js";

// [POST] /api/exams
export async function createNewExam(req, res) {
  const exam = req.body;
  try {
    if (!exam) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all required field" });
    }

    const alreadyExistExam = await Exam.findOne(exam.name);
    if (alreadyExistExam) {
      return res
        .status(400)
        .json({ success: false, message: "Already contain this exam" });
    }

    const newExam = new Exam(exam);
    await newExam.save();

    res.status(201).json({
      success: true,
      message: "Created new exam",
      newExam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateExam(req, res) {
  try {
    const { examId } = req.params;
    const { name, duration, total_questions, start_time, end_time } = req.body;

    // Find exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    // Update fields only if they are provided
    if (name) exam.name = name;
    if (duration) exam.duration = duration;
    if (total_questions) exam.total_questions = total_questions;
    if (start_time) exam.start_time = start_time;
    if (end_time) exam.end_time = end_time;

    // Save changes
    await exam.save();

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
