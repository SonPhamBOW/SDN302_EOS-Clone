import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createManyQuestion, getAllCourses } from "../../../apis/Admin.api";
import useAuthUser from "../../../hooks/useAuthUser";

interface ViewCourseDetailProps {
  openForm: (value: boolean) => void;
}

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  answers: Answer[];
}

const AddQuestionModal = ({ openForm }: ViewCourseDetailProps) => {
  const { authUser } = useAuthUser();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "question-1",
      question: "",
      answers: [
        { id: "a", text: "", isCorrect: false },
        { id: "b", text: "", isCorrect: false },
        { id: "c", text: "", isCorrect: false },
        { id: "d", text: "", isCorrect: false },
      ],
    },
  ]);

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    retry: false,
  });

  const [courseId, setCourseId] = useState(courses?.data[0]._id);

  const { mutate: createQuestions, isSuccess } = useMutation({
    mutationFn: createManyQuestion,
    onSuccess: () => {
      console.log("added new question suceess");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const addNewQuestion = () => {
    const newQuestionId = `question-${questions.length + 1}`;
    const newQuestion: Question = {
      id: newQuestionId,
      question: "",
      answers: [
        { id: "a", text: "", isCorrect: false },
        { id: "b", text: "", isCorrect: false },
        { id: "c", text: "", isCorrect: false },
        { id: "d", text: "", isCorrect: false },
      ],
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const deleteQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    }
  };

  const handleQuestionChange = (questionId: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (
    questionId: string,
    answerId: string,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, text: value } : a
              ),
            }
          : q
      )
    );
  };

  const handleCorrectChange = (questionId: string, answerId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) => ({
                ...a,
                isCorrect: a.id === answerId,
              })),
            }
          : q
      )
    );
  };

  const handleSubmit = () => {
    const payload = {
      questions: questions.map((q) => ({
        question: q.question,
        answers: q.answers,
      })),
    };

    const mappedQuestions = payload.questions.map((question) => ({
      course_id: courseId,
      type: "mcq",
      content: question.question,
      imageUrl: [],
      answers: question.answers.map((answer) => ({
        content: answer.text,
        isCorrect: answer.isCorrect,
      })),
      createdBy: authUser?._id,
    }));

    console.log(mappedQuestions);

    createQuestions(mappedQuestions);

    openForm(false);
  };
  return (
    <div
      onClick={() => openForm(false)}
      className="fixed inset-0 w-full h-screen bg-black/40 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-3/4 h-3/4 flex flex-col gap-4 bg-base-100 border border-gray-300 rounded-lg px-4 py-4 shadow-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2 w-2/3">
            <h1 className="text-xl font-semibold text-base-content">
              Create Questions for Course
            </h1>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="px-3 py-2 bg-base-100 border border-base-content rounded-lg text-lg font-medium focus:border-none"
            >
              {/* <option value="">Select Course</option> */}
              {courses?.data.map((course) => (
                <option value={course._id}>{course.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Questions
          </button>
        </div>

        {/* Form tạo câu hỏi */}
        <div className="w-full h-3/4 px-2 py-2 rounded-md overflow-y-auto flex flex-col gap-4">
          {questions.map((questionItem, index) => (
            <div key={questionItem.id} className="relative">
              <div className="flex gap-2">
                {/* Nhập câu hỏi */}
                <div className="w-1/2 bg-base-100 border border-base-content rounded-md p-4 relative">
                  {/* Delete button */}
                  {questions.length > 1 && (
                    <button
                      onClick={() => deleteQuestion(questionItem.id)}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete question"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <label className="font-medium text-base-content">
                    Question {index + 1}
                  </label>
                  <textarea
                    value={questionItem.question}
                    onChange={(e) =>
                      handleQuestionChange(questionItem.id, e.target.value)
                    }
                    placeholder="Enter your question..."
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={6}
                  />
                </div>

                {/* Nhập câu trả lời */}
                <div className="w-1/2 bg-base-100 border border-base-content rounded-md p-4">
                  <label className="font-medium text-base-content mb-2 block">
                    Answers
                  </label>
                  <div className="flex flex-col gap-3">
                    {questionItem.answers.map((ans) => (
                      <div
                        key={ans.id}
                        className="flex items-center gap-2 border border-base-content bg-base-100 rounded-md px-2 py-1"
                      >
                        <input
                          type="radio"
                          name={`correctAnswer-${questionItem.id}`}
                          checked={ans.isCorrect}
                          onChange={() =>
                            handleCorrectChange(questionItem.id, ans.id)
                          }
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={ans.text}
                          onChange={(e) =>
                            handleAnswerChange(
                              questionItem.id,
                              ans.id,
                              e.target.value
                            )
                          }
                          placeholder={`Answer ${ans.id.toUpperCase()}`}
                          className="flex-1 px-3 py-2 bg-base-100 border-0 focus:ring-0 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Separator line between questions */}
              {index < questions.length - 1 && (
                <div className="border-b border-gray-200 mt-4"></div>
              )}
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="flex w-full items-center justify-center">
          <button
            onClick={addNewQuestion}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-6 h-6" />
            <span className="font-medium">Add New Question</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
