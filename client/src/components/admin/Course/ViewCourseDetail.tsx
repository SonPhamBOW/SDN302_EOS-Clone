import { FaTimesCircle } from "react-icons/fa";
import type { Course } from "../../../types/Course.type";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

interface ViewCourseDetailProps {
  openForm: (value: boolean) => void;
  course: Course;
}

const ViewCourseDetail = ({ openForm, course }: ViewCourseDetailProps) => {
  return (
    <div
      onClick={() => openForm(false)}
      className="fixed inset-0 w-full h-screen bg-black/40 flex items-center justify-center z-50 mx-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-3/4 h-3/4 flex flex-col gap-4 border border-base-content bg-base-300 rounded-lg px-4 py-4"
      >
        {/* hello */}
        <div className="flex justify-between">
          <div className="flex flex-col items-start justify-start">
            <p className="text-3xl font-mono text-base-content">{course.name}</p>
            <p className="text-md font-mono text-base-content/50">
              {course.description}
            </p>
          </div>

          <FaTimesCircle
            onClick={() => openForm(false)}
            className="size-4 text-base-content hover:text-base-content/80 transition-colors duration-200 cursor-pointer"
          />
        </div>

        <div className="w-full h-3/4 grid grid-cols-2 gap-4 ">
          <Card
            title="Total Exam"
            value={``}
            pillText="2.75%"
            trend="up"
            period="Add Exam"
            buttonType="btn-primary"
          />

          <Card
            title="Students"
            value={`courses`}
            pillText="2.75%"
            trend="up"
            period="Add Student"
            buttonType="btn-secondary"
          />
        </div>
      </div>
    </div>
  );
};

const Card = ({
  title,
  pillText,
  trend,
  period,
  buttonType,
}: {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
  buttonType: string;
}) => {
  return (
    <div>
      <div className="w-full h-full bg-base-300 col-span-4 p-4 rounded border border-base-content/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base-content font-semibold text-left mb-2 text-sm">
              {title}
            </h3>
          </div>

          <span
            className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
              trend === "up"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />} {pillText}
          </span>
        </div>

        <div className="w-full h-3/4  overflow-y-scroll mb-5">
          <table className="table table-zebra w-full h-full">
            <thead className="text-base-content bg-base-200">
              <tr>
                <th className="px-4 py-2 text-left">Course Name</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Ví dụ dữ liệu mẫu */}
              {[
                {
                  id: 1,
                  name: "MATH101",
                  description: "Basic Mathematics",
                  created_by: "Admin",
                  createdAt: "2025-08-25",
                },
                {
                  id: 2,
                  name: "CS202",
                  description: "Introduction to Programming",
                  created_by: "Teacher A",
                  createdAt: "2025-08-20",
                },
                {
                  id: 2,
                  name: "CS202",
                  description: "Introduction to Programming",
                  created_by: "Teacher A",
                  createdAt: "2025-08-20",
                },
                {
                  id: 2,
                  name: "CS202",
                  description: "Introduction to Programming",
                  created_by: "Teacher A",
                  createdAt: "2025-08-20",
                },
                {
                  id: 2,
                  name: "CS202",
                  description: "Introduction to Programming",
                  created_by: "Teacher A",
                  createdAt: "2025-08-20",
                },
              ].map((course, index) => (
                <tr key={course.id} className="hover:bg-base-300">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{course.createdAt}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button className="btn btn-sm btn-primary">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className={`w-full btn ${buttonType}`}>{period}</button>
      </div>
    </div>
  );
};

export default ViewCourseDetail;
