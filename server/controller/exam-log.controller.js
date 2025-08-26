import { ExamLog } from "../models/ExamLog.js";

export async function createExamLog(req, res) {
  try {
    const {examId, note} = req.body;
    const userId = req.user.id;
    const examLog = await ExamLog.create({exam_id: examId, user_id: userId, note});
    res.status(201).json({success: true, message: "Exam log created successfully", data: examLog});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
}

export async function getExamLogs(req, res) {
  try {
    const examLogs = await ExamLog.find({exam_id: req.params.examId, user_id: req.params.userId});
    res.status(200).json({success: true, data: examLogs});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
}
