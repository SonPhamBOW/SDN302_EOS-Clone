const Question = require("../models/Question");

async function getRandomQuestions(course_id, total_questions) {
  // Fetch all questions for the given course
  const allQuestions = await Question.find({ course_id });

  if (allQuestions.length < total_questions) {
    throw new Error(
      `Not enough questions in the pool. Found ${allQuestions.length}, need ${total_questions}`
    );
  }

  // Shuffle array
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());

  // Return only the required number
  return shuffled.slice(0, total_questions);
}

module.exports = { getRandomQuestions };
