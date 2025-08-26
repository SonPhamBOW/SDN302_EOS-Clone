import { FaArrowRight } from "react-icons/fa";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { getAllCourses } from "../../apis/Admin.api";
import { useQuery } from "@tanstack/react-query";
import DropdownMenu from "../../components/admin/DropdownMenu";
import PageLoader from "../../components/PageLoader";

const MangeCourse = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    retry: false,
  });

  return (
    <div className="w-full h-screen px-4 overflow-y-scroll flex flex-col gap-4">
      <h1 className="text-base-content text-3xl">Manage Courses</h1>
      <div className="flex space-x-6">
        <Card
          title="Course detail"
          value={`${courses?.count.toString()} courses`}
          pillText="2.75%"
          trend="up"
          period="Add course"
        />
        <Card
          title="Exams Management"
          value="4 exams"
          pillText="2.75%"
          trend="up"
          period="Add exam"
        />
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-md shadow-md p-4 w-full border border-base-content h-1/2 overflow-y-auto">
        <table className="table table-zebra w-full">
          <thead className="text-base-content bg-base-200">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Course Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Created By</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  <PageLoader />
                </td>
              </tr>
            ) : (
              courses?.data.map((course, index) => (
                <tr key={course._id} className="hover:bg-base-300">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{course.name}</td>
                  <td className="px-4 py-2">{course.description}</td>
                  <td className="px-4 py-2">{course.created_by.name}</td>
                  <td className="px-4 py-2">
                    {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <DropdownMenu course={course} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MangeCourse;

const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
}: {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
}) => {
  return (
    <div className="w-full">
      <div className="col-span-4 p-4 rounded border border-stone-300">
        <div className="flex mb-8 items-start justify-between">
          <div>
            <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
            <p className="text-3xl font-semibold">{value}</p>
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
        <div className="w-full flex justify-end">
          <p
            className="text-base-content text-xs text-end hover:text-base-content/70 
        transition-colors duration-200 cursor-pointer flex items-center justify-end gap-2 w-fit"
          >
            {period}
            <FaArrowRight className="size-3 text-base-content" />
          </p>
        </div>
      </div>
    </div>
  );
};
