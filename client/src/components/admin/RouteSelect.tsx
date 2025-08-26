import type { IconType } from "react-icons";

import { FiHome, FiUsers } from "react-icons/fi";
import { PiExam } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router";

export const RouteSelect = () => {
  const location = useLocation();
  const curentPath = location.pathname;

  return (
    <div className="space-y-1">
      <Route
        Icon={FiHome}
        selected={curentPath === "/" ? true : false}
        title="Dashboard"
        link="/"
      />
      <Route
        Icon={PiExam}
        selected={curentPath === "/course" ? true : false}
        title="Course"
        link="/course"
      />
      <Route
        Icon={FiUsers}
        selected={curentPath === "/questions" ? true : false}
        title="Questions"
        link="/questions"
      />
    </div>
  );
};

const Route = ({
  selected,
  Icon,
  title,
  link,
}: {
  selected: boolean;
  Icon: IconType;
  title: string;
  link: string;
}) => {
  const navigate = useNavigate();

  return (
    <button
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
        selected
          ? "bg-base-content text-base-100 shadow"
          : "hover:bg-base-content/15 bg-transparent text-base-content shadow-none"
      }`}
      onClick={() => navigate(`${link}`)}
    >
      <Icon className={selected ? "text-violet-500" : ""} />
      <span>{title}</span>
    </button>
  );
};
