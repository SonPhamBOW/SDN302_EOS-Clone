import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

type ResultState = {
  summary?: {
    score: number;
    total_questions: number;
    correct_answers: number;
    wrong_answers: number;
    accuracy_rate: number;
    time_taken: number;
  };
  result?: unknown;
};

const ExamResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ResultState) || {};
  const s = state.summary;

  const storageKey = useMemo(() => `exam:${id}`, [id]);

  useEffect(() => {
    const keys = [
      `${storageKey}:answers`,
      `${storageKey}:index`,
      `${storageKey}:startedAt`,
      `${storageKey}:flags`,
      `${storageKey}:cache`,
    ];
    keys.forEach((k) => localStorage.removeItem(k));
  }, [storageKey]);

  return (
    <div className="h-full w-full p-6 text-base-content">
      <div className="max-w-3xl mx-auto border border-white rounded-xl p-6">
        <div className="text-2xl font-bold mb-2">Kết quả bài thi</div>
        <div className="opacity-70 mb-4">Mã đề: {id}</div>

        {s ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="stat">
              <div className="stat-title">Điểm</div>
              <div className="stat-value text-primary">{s.score}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Độ chính xác</div>
              <div className="stat-value">{s.accuracy_rate}%</div>
            </div>
            <div className="stat">
              <div className="stat-title">Số câu đúng</div>
              <div className="stat-value text-success">{s.correct_answers}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Số câu sai</div>
              <div className="stat-value text-error">{s.wrong_answers}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Tổng số câu</div>
              <div className="stat-value">{s.total_questions}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Thời gian làm</div>
              <div className="stat-value">{s.time_taken} phút</div>
            </div>
          </div>
        ) : (
          <div>Không có dữ liệu kết quả để hiển thị.</div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button className="btn" onClick={() => navigate("/")}>Về trang chủ</button>
          {/* <button className="btn btn-outline" onClick={() => navigate(`/exam/${id}`)}>Xem lại đề</button> */}
        </div>
      </div>
    </div>
  );
};

export default ExamResult;


