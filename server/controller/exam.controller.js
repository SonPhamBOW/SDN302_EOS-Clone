import Exam from "../models/Exam.js";
import { getRandomQuestions } from "../utils/getRandomQuestionsForExam.js";
import { shuffleQuestions } from "../utils/shuffleQuestions.js";
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

export async function takeExam(req, res) {
  try {
    const {examId} = req.params;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
    
    const {questions} = exam;
    const randomQuestions = getRandomQuestions(examId, exam.total_questions);
    
    res.status(200).json({
      success: true,
      message: "Exam taken successfully",
      data: {
        ...exam,
        questions: randomQuestions,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
