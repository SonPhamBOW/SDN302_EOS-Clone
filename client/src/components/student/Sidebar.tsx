import { Link, useLocation } from "react-router";
import { ShipWheelIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import useAuthUser from "../../hooks/useAuthUser";

const Sidebar = () => {
  const location = useLocation();
  const curentPath = location.pathname;
  const { authUser } = useAuthUser();

  console.log(authUser);

  return (
    <div
      className="w-64 bg-base-200 border-r border-base-200 hidden md:flex
    flex-col h-screen top-0"
    >
      <div className="p-5 ">
        <Link to={"/"} className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span
            className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r
        from-primary to-secondary tracking-wider"
          >
            EOS_Web
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to={"/"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-full
            ${curentPath === "/" ? "btn-active" : ""}`}
        >
          <DynamicIcon
            name={"home"}
            className="size-5 text-base-content opacity-70"
          />
          <span className="">Home</span>
        </Link>

        <Link
          to={"/student/stats"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-full
            ${curentPath === "/student/stats" ? "btn-active" : ""}`}
        >
          <DynamicIcon
            name={"bar-chart-2"}
            className="size-5 text-base-content opacity-70"
          />
          <span className="">My statistics</span>
        </Link>

        <Link
          to={"/student/available-exams"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-full
            ${curentPath === "/student/available-exams" ? "btn-active" : ""}`}
        >
          <DynamicIcon
            name={"calendar"}
            className="size-5 text-base-content opacity-70"
          />
          <span className="">Available exams</span>
        </Link>
      </nav>

      
    </div>
  );
};

export default Sidebar;
