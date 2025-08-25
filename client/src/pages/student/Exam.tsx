// bỏ mutation; sử dụng cache thủ công theo examId
import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Bounce, toast } from "react-toastify";
import { logExamEvent, submitExam as submitExamApi, takeExam } from "../../apis/Student.api";
import { useThemeStore } from "../../store/useThemeStore";
import type { ExamData, Question } from "../../types/Exam.type";

type ApiErrorResponse = {
  message?: string;
};

type AnswersState = Record<string, string>; // key: questionId, value: answerId or text
type FlagState = Record<string, boolean>; // key: questionId, value: flagged

const formatTime = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}m : ${seconds}s`;
};

export const Exam = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const storageKey = useMemo(() => `exam:${examId}`, [examId]);
  const answersKey = `${storageKey}:answers`;
  const startedAtKey = `${storageKey}:startedAt`;
  const indexKey = `${storageKey}:index`;
  const flagsKey = `${storageKey}:flags`;

  const [exam, setExam] = useState<ExamData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [flags, setFlags] = useState<FlagState>({});
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const restorePersistedState = () => {
    const savedAnswers = localStorage.getItem(answersKey);
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers) as AnswersState;
        setAnswers(parsed);
      } catch {
        // ignore
      }
    }

    const savedIndex = Number(localStorage.getItem(indexKey) || 0);
    if (!Number.isNaN(savedIndex)) setCurrentIndex(savedIndex);

    const savedStarted = localStorage.getItem(startedAtKey);
    if (savedStarted) {
      const v = Number(savedStarted);
      setStartedAtMs(Number.isFinite(v) ? v : Date.now());
    } else {
      const now = Date.now();
      localStorage.setItem(startedAtKey, String(now));
      setStartedAtMs(now);
    }

    const savedFlags = localStorage.getItem(flagsKey);
    if (savedFlags) {
      try {
        const parsedFlags = JSON.parse(savedFlags) as FlagState;
        setFlags(parsedFlags);
      } catch {
        // ignore
      }
    }
  };

  const loadExam = async (idParam: string) => {
    try {
      setIsLoading(true);
      // init or restore timing/answers first
      restorePersistedState();

      // check cache by examId
      const cacheKey = `${storageKey}:cache`;
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        try {
          const cached = JSON.parse(cachedStr) as { data: ExamData; expireAt: number };
          if (cached && cached.expireAt && Date.now() < cached.expireAt) {
            setExam(cached.data);
            return; // valid cache
          }
        } catch {
          // ignore
        }
      }

      // fetch and write cache
      const res = await takeExam(idParam);
      const data = res.data;
      setExam(data);

      // compute expireAt = startedAt + duration + 5m
      const started = Number(localStorage.getItem(startedAtKey)) || Date.now();
      const expireAt = started + data.duration * 60 * 1000 + 5 * 60 * 1000;
      localStorage.setItem(cacheKey, JSON.stringify({ data, expireAt }));
    } catch (error: unknown) {
      let errMsg = "Something went wrong";
      if (error && error instanceof AxiosError) {
        const errData = error.response?.data as ApiErrorResponse | undefined;
        errMsg = errData?.message || errMsg;
      }
      toast.error(errMsg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: theme == "cupcake" ? "light" : "dark",
        transition: Bounce,
        closeButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (examId) loadExam(examId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // tick timer
  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Log khi đổi tab và trước khi rời trang
  useEffect(() => {
    if (!examId) return;
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        logExamEvent(examId, "Tab hidden").catch(() => {});
      } else if (document.visibilityState === "visible") {
        logExamEvent(examId, "Tab visible").catch(() => {});
      }
    };
    const handleBeforeUnload = () => {
      navigator.sendBeacon?.(
        `${window.location.origin}/api/exam-logs`,
        new Blob([JSON.stringify({ examId, note: "Page unload" })], { type: "application/json" })
      );
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [examId]);

  const remainingMs = useMemo(() => {
    if (!exam || !startedAtMs) return 0;
    return Math.max(0, startedAtMs + exam.duration * 60 * 1000 - nowMs);
  }, [exam, startedAtMs, nowMs]);

  const isTimeUp = remainingMs <= 0 && !!exam;

  const answeredCount = useMemo(() => {
    if (!exam) return 0;
    return exam.questions.reduce((count, q) => {
      const val = answers[q._id];
      if (val == null) return count;
      if (q.type === "essay") return count + (val.trim().length > 0 ? 1 : 0);
      return count + 1;
    }, 0);
  }, [exam, answers]);

  const autoSubmitRef = useRef<boolean>(false);

  const handlePickAnswer = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value };
        localStorage.setItem(answersKey, JSON.stringify(next));
        return next;
      });
    },
    [answersKey]
  );

  const goToIndex = useCallback(
    (idx: number) => {
      if (!exam) return;
      const bounded = Math.min(Math.max(0, idx), exam.questions.length - 1);
      setCurrentIndex(bounded);
      localStorage.setItem(indexKey, String(bounded));
    },
    [exam, indexKey]
  );

  const reloadExam = () => {
    if (examId) {
      // xóa cache để bắt buộc tải lại
      localStorage.removeItem(`${storageKey}:cache`);
      loadExam(examId);
    }
  };

  const currentQuestion: Question | undefined = useMemo(() => {
    if (!exam) return undefined;
    return exam.questions[currentIndex];
  }, [exam, currentIndex]);

  const toggleFlag = useCallback(() => {
    const q = currentQuestion;
    if (!q) return;
    setFlags((prev) => {
      const next = { ...prev, [q._id]: !prev[q._id] };
      localStorage.setItem(flagsKey, JSON.stringify(next));
      return next;
    });
  }, [currentQuestion, flagsKey]);

  const submitExam = useCallback(async () => {
    if (!exam) return;
    // build payload {question_id, student_answer}; lấy content đáp án từ question.answers
    const payloadAnswers = exam.questions.map((q: Question) => {
      const selectedKey = answers[q._id];
      let studentAnswer: string | null = null;
      if (q.type === "essay") {
        studentAnswer = selectedKey && selectedKey.trim().length > 0 ? selectedKey : null;
      } else {
        // selectedKey có thể là option._id hoặc index fallback
        const answerById = q.answers.find((a) => String((a as unknown as { _id?: string })._id || "") === selectedKey);
        if (answerById) {
          studentAnswer = answerById.content;
        } else if (selectedKey != null) {
          const idx = Number(selectedKey);
          if (Number.isInteger(idx) && idx >= 0 && idx < q.answers.length) {
            studentAnswer = q.answers[idx].content;
          }
        }
      }
      return { question_id: q._id, student_answer: studentAnswer };
    });

    const timeTakenMin = startedAtMs ? Math.ceil((Date.now() - startedAtMs) / 60000) : 0;

    try {
      setIsSubmitting(true);
      const res = await submitExamApi(examId as string, {
        answers: payloadAnswers,
        timeTaken: timeTakenMin,
      });
      const s = res.data.summary;
      toast.success(
        `Nộp bài thành công. Điểm: ${s.score} | Đúng ${s.correct_answers}/${s.total_questions} | Thời gian: ${s.time_taken}p`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          theme: theme == "cupcake" ? "light" : "dark",
          transition: Bounce,
          closeButton: false,
        }
      );
      setIsConfirmOpen(false);
      navigate(`/exam/${examId}/result`, { state: res.data });
    } catch (error: unknown) {
      let errMsg = "Nộp bài thất bại";
      if (error && (error as unknown as { response?: { data?: { message?: string } } }).response?.data?.message) {
        errMsg = (error as unknown as { response: { data: { message: string } } }).response.data.message;
      }
      toast.error(errMsg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: theme == "cupcake" ? "light" : "dark",
        transition: Bounce,
        closeButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, exam, examId, startedAtMs, theme, navigate]);

  // Tự động nộp bài khi hết giờ (chỉ 1 lần)
  useEffect(() => {
    if (isTimeUp && !autoSubmitRef.current) {
      autoSubmitRef.current = true;
      setIsConfirmOpen(false);
      if (examId) logExamEvent(examId, "Auto submit due to timeout").catch(() => {});
      submitExam();
    }
  }, [isTimeUp, examId, submitExam]);

  const renderAnswers = (question: Question) => {
    if (question.type === "essay") {
      const value = answers[question._id] || "";
      return (
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Nhập câu trả lời"
          value={value}
          onChange={(e) => handlePickAnswer(question._id, e.target.value)}
          disabled={isTimeUp}
        />
      );
    }

    // Với mcq/true_false: dùng opt._id nếu có, nếu không fallback về index để đảm bảo không tự chọn
    return (
      <div className="flex flex-col gap-3">
        {question.answers.map((opt, idx: number) => {
          const optionKey: string = (opt && typeof opt._id === "string") ? opt._id : String(idx);
          const selected = answers[question._id] === optionKey;
          return (
            <label key={optionKey} className="flex items-center gap-3 p-3 rounded-lg border border-white">
              <input
                type="radio"
                name={`q-${question._id}`}
                className="radio radio-primary"
                checked={selected}
                onChange={() => handlePickAnswer(question._id, optionKey)}
                disabled={isTimeUp}
              />
              <span className="select-none">{String.fromCharCode(65 + idx)}. {opt.content}</span>
            </label>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full w-full p-4 sm:p-6 text-base-content">
      {isLoading || !exam ? (
        <div>Đang tải đề thi...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Left panel */}
          <div className="lg:col-span-1 border border-white rounded-xl p-4 flex flex-col gap-4">
            <div>
              <div className="font-semibold mb-1">{exam.name}</div>
              <progress
                className="progress progress-primary w-full"
                value={exam.duration * 60 * 1000 - remainingMs}
                max={exam.duration * 60 * 1000}
              />
              <div className="mt-2 text-primary font-semibold">Thời gian còn lại</div>
              <div className="text-xl font-bold">{formatTime(remainingMs)}</div>
              {isTimeUp && <div className="text-error text-sm mt-1">Đã hết giờ</div>}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => {
                const isAnswered = Boolean(answers[q._id]);
                const isActive = idx === currentIndex;
                const isFlagged = Boolean(flags[q._id]);
                const btnClass = isActive
                  ? "btn-primary"
                  : isFlagged
                  ? "btn-warning"
                  : isAnswered
                  ? "btn-success"
                  : "";
                return (
                  <button
                    key={q._id}
                    className={`btn btn-sm ${btnClass}`}
                    onClick={() => goToIndex(idx)}
                    disabled={isTimeUp}
                    title={isFlagged ? "Đã đánh dấu" : isAnswered ? "Đã trả lời" : "Chưa trả lời"}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button className="btn" onClick={() => goToIndex(currentIndex - 1)} disabled={currentIndex === 0}>
                ← Trước
              </button>
              <button
                className="btn"
                onClick={() => goToIndex(currentIndex + 1)}
                disabled={currentIndex >= exam.questions.length - 1}
              >
                Tiếp theo →
              </button>
              <button
                className={`btn ${flags[currentQuestion?._id || ""] ? "btn-warning" : "btn-outline"}`}
                onClick={toggleFlag}
              >
                {flags[currentQuestion?._id || ""] ? "Bỏ đánh dấu" : "Đánh dấu"}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="btn btn-outline bg-primary text-primary-content"
                onClick={() => setIsConfirmOpen(true)}
                disabled={isTimeUp}
              >
                Nộp bài
              </button>
            </div>

            <div className="collapse collapse-arrow border border-white rounded-box">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium">Lưu ý khi làm bài</div>
              <div className="collapse-content text-sm opacity-70">
                <p>- Không đóng tab trình duyệt khi đang làm bài.</p>
                <p>- Hệ thống tự lưu đáp án mỗi khi bạn chọn.</p>
                <p>- Hết giờ hệ thống sẽ khóa thao tác.</p>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 border border-white rounded-xl p-5">
            <div className="text-primary font-bold flex items-center gap-2">
              <span>CÂU HỎI {currentIndex + 1} ({currentQuestion?.type?.toUpperCase()})</span>
              {currentQuestion && flags[currentQuestion._id] && (
                <span className="badge badge-warning">Đã đánh dấu</span>
              )}
            </div>
            <div className="mt-3 text-lg">{currentQuestion?.content}</div>
            {currentQuestion?.imageUrl && currentQuestion.imageUrl.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {currentQuestion.imageUrl.map((src) => (
                  <img key={src} src={src} alt="question" className="max-h-64 object-contain" />
                ))}
              </div>
            )}
            <div className="mt-5">
              {currentQuestion ? renderAnswers(currentQuestion) : null}
            </div>
          </div>

          {/* Confirm submit modal */}
          {isConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60" onClick={() => setIsConfirmOpen(false)} />
              <div className="relative bg-base-100 text-base-content border border-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="text-lg font-semibold mb-2">Xác nhận nộp bài</div>
                <p className="opacity-80 mb-4">Bạn đã hoàn thành {answeredCount}/{exam.questions.length} câu.</p>
                <div className="flex items-center justify-end gap-3">
                  <button className="btn" onClick={() => setIsConfirmOpen(false)} disabled={isSubmitting}>Hủy</button>
                  <button className={`btn btn-primary ${isSubmitting ? "loading" : ""}`} onClick={submitExam} disabled={isSubmitting}>
                    {isSubmitting ? "Đang nộp..." : "Xác nhận nộp"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};