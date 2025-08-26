import { Link } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { getMyCourses, getAvailableExams, type AvailableExam, type MyCourse } from "../../apis/Student.api";

const Homepage = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [exams, setExams] = useState<AvailableExam[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesData, examsData] = await Promise.all([
        getMyCourses(),
        getAvailableExams()
      ]);
      setCourses(coursesData);
      setExams(examsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatus = (exam: AvailableExam): 'upcoming' | 'ongoing' | 'completed' => {
    const now = new Date();
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };

  const getStatusBadge = (status: 'upcoming' | 'ongoing' | 'completed') => {
    const statusConfig = {
      upcoming: { class: 'badge-warning', text: 'Chưa mở' },
      ongoing: { class: 'badge-success', text: 'Đang mở' },
      completed: { class: 'badge-neutral', text: 'Đã kết thúc' }
    };
    const config = statusConfig[status];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 overflow-auto max-h-screen">
        <div className="container mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Student dashboard</h2>
            <div className="flex gap-2">
              <Link to={"/student/stats"} className="btn btn-primary btn-sm">My statistics</Link>
              <Link to={"/student/available-exams"} className="btn btn-outline btn-sm">Available exams</Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 overflow-auto max-h-screen">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Student dashboard</h2>
          <div className="flex gap-2">
            <Link to={"/student/stats"} className="btn btn-primary btn-sm">My statistics</Link>
            <Link to={"/student/available-exams"} className="btn btn-outline btn-sm">Available exams</Link>
          </div>
        </div>

        {/* Courses Table */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Khóa học đang học</h3>
            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên khóa học</th>
                      <th>Mã khóa học</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, index) => (
                      <tr key={course._id}>
                        <td>{index + 1}</td>
                        <td className="font-medium">{course.name}</td>
                        <td>
                          <span className="badge badge-outline">
                            {course.course_code || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-success">Đang học</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có khóa học nào được đăng ký.</p>
              </div>
            )}
          </div>
        </div>

        {/* Exam Schedule Table */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Lịch thi</h3>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Bạn chưa đăng ký khóa học nào. Vui lòng liên hệ admin để được đăng ký khóa học.</p>
              </div>
            ) : exams.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên bài thi</th>
                      <th>Khóa học</th>
                      <th>Thời gian bắt đầu</th>
                      <th>Thời gian kết thúc</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam, index) => {
                      const status = getStatus(exam);
                      return (
                        <tr key={exam._id}>
                          <td>{index + 1}</td>
                          <td className="font-medium">{exam.name}</td>
                          <td>
                            <div className="flex flex-col gap-1">
                              <span>{exam.course_id?.name || "Không xác định"}</span>
                              {exam.course_id?.course_code && (
                                <span className="badge badge-outline badge-sm">
                                  {exam.course_id.course_code}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="text-sm">
                              {new Date(exam.start_time).toLocaleString('vi-VN')}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm">
                              {new Date(exam.end_time).toLocaleString('vi-VN')}
                            </span>
                          </td>
                          <td>
                            {getStatusBadge(status)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có bài thi nào được lên lịch cho các khóa học bạn đã đăng ký.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;