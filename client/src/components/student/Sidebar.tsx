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

      <div className="absolute flex items-center gap-2 bottom-1 left-1">
        <div className="avatar size-10">
          <img
            src={
              "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/520089009_1111422464206872_2290300607537407052_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=zuUQE0oikr0Q7kNvwE6snEY&_nc_oc=Adl4_3NpLNB7gf4Nvr4t9JIL05B9w7Fj4JJARKdK8202A0N62sK8BFiZKZZIof2u_3rhI4aQaArmmFHnMM_joAQG&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=w5Qgj2c7Vg4nHKSzJsEPIQ&oh=00_AfWJjZOLSEBJvxyt8XlA64DaYNWHuqeth2gemcoj36sNfg&oe=68B076A3"
            }
            alt=""
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-bold font-mono">{authUser?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
