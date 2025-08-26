import { EyeIcon, PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import {
  getAllCourses,
  deleteCourse,
  enrollStudent,
  searchStudents,
  updateCourse,
  createCourse,
} from "../../apis/Admin.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const MangeCourse = () => {
  const queryClient = useQueryClient();

  const courses = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    retry: false,
  });

  const { mutate: removeCourse } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });

  // Enroll student mutation
  const { mutate: enroll } = useMutation({
    mutationFn: enrollStudent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      alert(data.message); // Show success message
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Enroll failed"); // Show error message
    },
  });

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    course_code: "",
  });

  const { mutate: addCourse } = useMutation({
    mutationFn: createCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      alert(data.message);
      setIsCreateModalOpen(false);
      setNewCourse({ name: "", description: "", course_code: "" });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Create failed");
    },
  });
  // Update course mutation
  const { mutate: editCourse } = useMutation({
    mutationFn: updateCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      alert(data.message);
      setIsEditModalOpen(false);
      setEditingCourse(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Update failed");
    },
  });
  // Fetch students based on search input
  const { data: students } = useQuery({
    queryKey: ["students", search],
    queryFn: () => searchStudents(search),
    enabled: search.length > 0,
  });

  return (
    <div className="w-full h-screen px-4 overflow-y-scroll flex flex-col gap-4">
      <h1 className="text-base-content text-3xl">Manage Courses</h1>
      <div
        className="flex space-x-6 cursor-pointer"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <Card
          title="Course detail"
          value={`${courses.data?.count.toString()} courses`}
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
            {/* Ví dụ dữ liệu mẫu */}
            {courses.data?.data?.map((course, index) => (
              <tr key={course._id} className="hover:bg-base-300">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{course.name}</td>
                <td className="px-4 py-2">{course.description}</td>
                <td className="px-4 py-2">{course.created_by.name}</td>
                <td className="px-4 py-2">
                  {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      setSelectedCourseId(course._id);
                      setIsModalOpen(true);
                    }}
                  >
                    <PlusIcon className="size-3" />
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setEditingCourse(course);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <PencilIcon className="size-3" />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this student?")
                      ) {
                        removeCourse(course._id);
                      }
                    }}
                  >
                    <TrashIcon className="size-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <h2 className="text-lg font-semibold mb-4">Create Course</h2>
        <input
          type="text"
          placeholder="Course name"
          value={newCourse.name}
          onChange={(e) =>
            setNewCourse((prev) => ({ ...prev, name: e.target.value }))
          }
          className="input input-bordered w-full mb-4"
          required
        />
        <input
          type="text"
          placeholder="Course code (optional)"
          value={newCourse.course_code}
          onChange={(e) =>
            setNewCourse((prev) => ({ ...prev, course_code: e.target.value }))
          }
          className="input input-bordered w-full mb-4"
        />
        <textarea
          placeholder="Description"
          value={newCourse.description}
          onChange={(e) =>
            setNewCourse((prev) => ({ ...prev, description: e.target.value }))
          }
          className="textarea textarea-bordered w-full mb-4"
        />
        <button
          className="btn btn-primary w-full"
          onClick={() => {
            if (!newCourse.name || !newCourse.description) {
              alert("Name and description are required");
              return;
            }
            addCourse({
              name: newCourse.name,
              description: newCourse.description,
              course_code: newCourse.course_code?.trim() || undefined,
              created_by: "admin-id-placeholder",
            });
          }}
        >
          Create Course
        </button>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">Enroll a Student</h2>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        {/* Search results */}
        <div className="max-h-60 overflow-y-auto mb-4">
          {students && students.length > 0 ? (
            students.map((student: any) => {
              const isSelected = selectedStudentId === student._id;
              return (
                <div
                  key={student._id}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    isSelected ? "bg-blue-100" : ""
                  }`}
                  onClick={() =>
                    setSelectedStudentId((prev) =>
                      prev === student._id ? null : student._id
                    )
                  }
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                  {isSelected && <span>✅</span>}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No students found</p>
          )}
        </div>
        <button
          className={`btn w-full ${
            selectedStudentId && selectedCourseId
              ? "btn-primary"
              : "btn-disabled"
          }`}
          disabled={!selectedStudentId || !selectedCourseId}
          onClick={() => {
            if (!selectedStudentId || !selectedCourseId) return;

            enroll({
              courseId: selectedCourseId,
              studentId: selectedStudentId,
            });

            // reset modal state after triggering mutation
            setIsModalOpen(false);
            setSelectedStudentId(null);
            setSearch("");
          }}
        >
          Enroll
        </button>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">Edit Course</h2>
        <input
          type="text"
          placeholder="Course name"
          value={editingCourse?.name || ""}
          onChange={(e) =>
            setEditingCourse((prev: any) => ({ ...prev, name: e.target.value }))
          }
          className="input input-bordered w-full mb-4"
          required
        />
        <input
          type="text"
          placeholder="Course code (optional)"
          value={editingCourse?.course_code || ""}
          onChange={(e) =>
            setEditingCourse((prev: any) => ({
              ...prev,
              course_code: e.target.value,
            }))
          }
          className="input input-bordered w-full mb-4"
        />
        <textarea
          placeholder="Description"
          value={editingCourse?.description || ""}
          onChange={(e) =>
            setEditingCourse((prev: any) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="textarea textarea-bordered w-full mb-4"
        />
        <button
          className="btn btn-primary w-full"
          onClick={() => {
            if (!editingCourse?.name || !editingCourse?.description) {
              alert("Name and description are required");
              return;
            }
            editCourse({
              id: editingCourse._id,
              name: editingCourse.name,
              description: editingCourse.description,
              course_code: editingCourse.course_code?.trim() || undefined,
            });
          }}
        >
          Save Changes
        </button>
      </Modal>
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
