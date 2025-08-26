import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCourses,
  getQuestionsByCourse,
  updateQuestion,
} from "../../apis/Admin.api";
import PageLoader from "../../components/PageLoader";
import { useState } from "react";
import AddQuestionModal from "../../components/admin/AddQuestionModal/AddQuestionModal";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BsThreeDots } from "react-icons/bs";
import { PencilIcon, TrashIcon } from "lucide-react";
import { TiTimesOutline } from "react-icons/ti";
import { Bounce, toast } from "react-toastify";

const ManageQuestions = () => {
  const queryClient = useQueryClient();
  const { data: courses} = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    retry: false,
  });

  const [courseId, setCourseId] = useState<string | undefined>(
    courses?.data[0]._id
  );

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["questions", courseId],
    queryFn: () => getQuestionsByCourse(courseId),
    retry: false,
    enabled: !!courseId, // chỉ fetch khi có courseId
  });

  const [isOpenForm, setIsOpenForm] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [questionSelected, setQuestionSelected] = useState();

  const handleEditQuestion = (question) => {
    setShowEditModal(true);
    setQuestionSelected(question);
  };

  const { mutate: editQuestionSave } = useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setShowEditModal(false);
      toast.success("Update question success", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        transition: Bounce,
        closeButton: false,
      });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleSaveChange = () => {
    editQuestionSave({
      questionId: questionSelected._id.toString(),
      data: {
        content: questionSelected.content,
        answers: questionSelected.answers,
      },
    });
  };

  return (
    <div className="w-full h-screen px-4 overflow-y-scroll flex flex-col gap-4">
      <div className="flex w-full justify-between">
        <h1 className="font-medium text-2xl">Question List</h1>

        <button onClick={() => setIsOpenForm(true)} className="btn btn-primary">
          Add question
        </button>
      </div>

      <div className="w-64">
        <select
          className="select select-bordered w-full max-w-xs bg-base-100 border border-base-content
         rounded-md px-3 py-2 text-base-content 
         focus:outline-none
          transition"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          {courses?.data.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-md p-4 w-full h-1/2 overflow-y-auto">
        <table className="table table-zebra w-full">
          <thead className="text-base-content bg-base-200">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingQuestions ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <PageLoader />
                </td>
              </tr>
            ) : (
              questions?.data.map((q: any, index: number) => (
                <tr key={q._id} className="hover:bg-base-300">
                  <td>{index + 1}</td>
                  <td>{q.content}</td>
                  <td>{q.createdBy?.name}</td>
                  <td>{new Date(q.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <Menu>
                      <MenuButton
                        className="inline-flex items-center gap-2 rounded-md 
                            bg-base-300 hover:bg-base-content/50 transition-colors duration-200 px-3 py-1.5 text-sm/6 font-semibold 
                          text-white focus:not-data-focus:outline-none 
                            data-focus:outline data-focus:outline-white 
                            data-hover:bg-gray-700 data-open:bg-gray-700"
                      >
                        <BsThreeDots />
                      </MenuButton>

                      <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-52 origin-top-right rounded-xl border border-white/5 bg-base-300 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                      >
                        <MenuItem>
                          <button
                            onClick={() => handleEditQuestion(q)}
                            className="group hover:bg-base-200 transition-colors duration-200 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
                          >
                            <PencilIcon className="size-4 fill-white/30" />
                            Edit
                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">
                              ⌘E
                            </kbd>
                          </button>
                        </MenuItem>
                        <div className="my-1 h-px bg-white/5" />
                        <MenuItem>
                          <button className="group hover:bg-error/50 transition-colors duration-200 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                            <TrashIcon className="size-4 fill-white/30" />
                            Delete
                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">
                              ⌘D
                            </kbd>
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div
          onClick={() => setShowEditModal(false)}
          className="fixed inset-0 w-full h-screen bg-black/40 flex items-center justify-center z-50"
        >
          <div
            className="w-3/4 h-3/4 bg-base-300 border border-base-content rounded-md px-4 py-4 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end items-center w-full">
              <TiTimesOutline
                className="text-base-content size-5"
                onClick={() => setShowEditModal(false)}
              />
            </div>

            <textarea
              value={questionSelected?.content || ""}
              onChange={(e) =>
                setQuestionSelected((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              className="textarea textarea-bordered w-full h-2/5 text-3xl"
            />

            <div className="w-full bg-base-100 border border-base-content rounded-md p-4">
              <label className="font-medium text-base-content mb-2 block">
                Answers
              </label>
              <div className="grid grid-cols-2 gap-3">
                {questionSelected?.answers?.map((ans) => (
                  <div
                    key={ans._id}
                    className="flex items-center gap-2 border border-base-content bg-base-100 rounded-md px-2 py-1"
                  >
                    <input
                      type="radio"
                      checked={ans.isCorrect}
                      onChange={() => {
                        setQuestionSelected((prev) => ({
                          ...prev,
                          answers: prev.answers.map((a) => ({
                            ...a,
                            isCorrect: a._id === ans._id,
                          })),
                        }));
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={ans.content}
                      onChange={(e) => {
                        const newText = e.target.value;
                        setQuestionSelected((prev) => ({
                          ...prev,
                          answers: prev.answers.map((a) =>
                            a._id === ans._id ? { ...a, content: newText } : a
                          ),
                        }));
                      }}
                      className="flex-1 px-3 py-2 bg-base-100 border-0 focus:ring-0 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button onClick={handleSaveChange} className="btn btn-primary">
                Save Change
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpenForm ? (
        <div className="space-x-0">
          {" "}
          <AddQuestionModal openForm={setIsOpenForm} />{" "}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ManageQuestions;
