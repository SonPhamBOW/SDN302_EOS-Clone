import { EyeIcon, PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
  getStudentById,
} from "../../apis/Student.api";

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

const ManageStudents = () => {
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: studentDetails } = useQuery({
    queryKey: ["studentDetails", selectedStudentId],
    queryFn: () => getStudentById(selectedStudentId!),
    enabled: !!selectedStudentId && isDetailsOpen,
  });

  const students = useQuery({
    queryKey: ["students"],
    queryFn: getAllStudents,
    retry: false,
  });

  const { mutate: editStudent } = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] }); // refresh student list
      setIsEditModalOpen(false); // close modal
      setEditingStudent(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to update student");
    },
  });

  const { mutate: removeStudent } = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] }); // refresh list
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Failed to delete student");
    },
  });

  return (
    <div className="w-full h-screen px-4 overflow-y-scroll flex flex-col gap-4">
      <h1 className="text-base-content text-3xl">Manage Students</h1>

      <div className="overflow-x-auto bg-base-100 rounded-md shadow-md p-4 w-full border border-base-content h-1/2 overflow-y-auto">
        <table className="table table-zebra w-full">
          <thead className="text-base-content bg-base-200">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Student Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-center">Verified</th>
              <th className="px-4 py-2 text-center">Last Login</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Ví dụ dữ liệu mẫu */}
            {students?.data?.data?.map(
              (
                student: {
                  _id: string;
                  name: string;
                  email: string;
                  isVerified: boolean;
                  lastLogin?: string;
                },
                index: number
              ) => (
                <tr key={student._id} className="hover:bg-base-300">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{student.name}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2 text-center">
                    {student.isVerified ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {student.lastLogin
                      ? new Date(student.lastLogin).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setSelectedStudentId(student._id);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <EyeIcon className="size-3" />
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setEditingStudent(student);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <PencilIcon className="size-3" />
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this student?"
                          )
                        ) {
                          removeStudent(student._id);
                        }
                      }}
                    >
                      <TrashIcon className="size-3" />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">Edit Student</h2>

        {/* Student Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={editingStudent?.name || ""}
          onChange={(e) =>
            setEditingStudent((prev: any) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          className="input input-bordered w-full mb-4"
          required
        />

        {/* Verified Status */}
        <label className="block mb-2 font-medium">Verified</label>
        <select
          value={editingStudent?.isVerified ? "true" : "false"}
          onChange={(e) =>
            setEditingStudent((prev: any) => ({
              ...prev,
              isVerified: e.target.value === "true",
            }))
          }
          className="select select-bordered w-full mb-4"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* Save button */}
        <button
          className="btn btn-primary w-full"
          onClick={() => {
            if (!editingStudent?.name) {
              alert("Name is required");
              return;
            }
            editStudent({
              id: editingStudent._id,
              name: editingStudent.name.trim(),
              isVerified: editingStudent.isVerified,
            });
          }}
        >
          Save Changes
        </button>
      </Modal>

      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">Student Details</h2>

        {studentDetails?.data ? (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {studentDetails.data.name}
            </p>
            <p>
              <strong>Email:</strong> {studentDetails.data.email}
            </p>
            <p>
              <strong>Last Login:</strong>{" "}
              {studentDetails.data.lastLogin
                ? new Date(studentDetails.data.lastLogin).toLocaleString()
                : "Never"}
            </p>
            <p>
              <strong>Verified:</strong>{" "}
              {studentDetails.data.isVerified ? (
                <span className="text-green-600 font-semibold">Yes</span>
              ) : (
                <span className="text-red-600 font-semibold">No</span>
              )}
            </p>
            <div>
              <strong>Courses Enrolled:</strong>
              {studentDetails.data.courses.length > 0 ? (
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {studentDetails.data.courses.map((course) => (
                    <li key={course._id}>
                      <span className="font-medium">{course.name}</span>
                      {course.course_code && (
                        <span className="text-gray-500 ml-1">
                          ({course.course_code})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-1">No courses enrolled</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default ManageStudents;
