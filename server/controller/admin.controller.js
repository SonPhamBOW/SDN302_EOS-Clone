import { User } from "../models/User.js";
import { ExamResult } from "../models/ExamResult.js";
import xlsx from "xlsx";

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
//get all exam results
export async function getExamResults(req, res) {
  try {
    const { courseId, studentId, archived } = req.query;

    const filter = {};
    if (courseId) filter.course_id = courseId;
    if (studentId) filter.student_id = studentId;
    if (archived === 'true') filter.archived = true;
    if (archived === 'false') filter.archived = false;

    const results = await ExamResult.find(filter)
      .populate('student_id', 'name email')
      .populate('course_id', 'name')
      .populate('exam_id', 'name start_time end_time')
      .sort({ submitted_at: -1 });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function exportExamResultsExcel(req, res) {
  try {
    const { courseId, studentId, archived } = req.query;
    const filter = {};
    if (courseId) filter.course_id = courseId;
    if (studentId) filter.student_id = studentId;
    if (archived === 'true') filter.archived = true;
    if (archived === 'false') filter.archived = false;

    const results = await ExamResult.find(filter)
      .populate('student_id', 'name email')
      .populate('course_id', 'name')
      .populate('exam_id', 'name')
      .lean();

    const rows = results.map(r => ({
      Student: r.student_id?.name,
      Email: r.student_id?.email,
      Course: r.course_id?.name,
      Exam: r.exam_id?.name,
      Score: r.score,
      Correct: r.correct_answers,
      Wrong: r.wrong_answers,
      TotalQuestions: r.total_questions,
      Accuracy: r.total_questions ? Math.round((r.correct_answers / r.total_questions) * 10000) / 100 : 0,
      TimeTakenMinutes: r.time_taken,
      SubmittedAt: new Date(r.submitted_at).toISOString(),
      Archived: r.archived ? 'Yes' : 'No',
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(rows);
    xlsx.utils.book_append_sheet(wb, ws, 'ExamResults');
    const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="exam-results.xlsx"');
    return res.status(200).send(buf);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function archiveExamResults(req, res) {
  try {
    const { resultIds, archived } = req.body; // { resultIds: [], archived: true|false }
    if (!Array.isArray(resultIds) || resultIds.length === 0) {
      return res.status(400).json({ success: false, message: 'resultIds is required' });
    }

    const update = await ExamResult.updateMany(
      { _id: { $in: resultIds } },
      { $set: { archived: Boolean(archived) } }
    );

    res.status(200).json({ success: true, matched: update.matchedCount, modified: update.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
