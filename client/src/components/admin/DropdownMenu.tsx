import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import type { Course } from "../../types/Course.type";
import ViewCourseDetail from "./Course/ViewCourseDetail";
import { useState } from "react";

export default function DropdownMenu({ course }: Course) {
  const [isOpenForm, setIsOpenForm] = useState(false);

  return (
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
          <button className="group hover:bg-base-200 transition-colors duration-200 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
            <PencilIcon className="size-4 fill-white/30" />
            Edit
            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">
              ⌘E
            </kbd>
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={() => setIsOpenForm(true)}
            className="group hover:bg-base-200 transition-colors duration-200 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
          >
            <EyeIcon className="size-4 fill-white/30" />
            View
            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">
              ⌘D
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

      {isOpenForm ? (
        <div className="space-x-0">
          {" "}
          <ViewCourseDetail openForm={setIsOpenForm} course={course} />{" "}
        </div>
      ) : (
        <></>
      )}
    </Menu>
  );
}
