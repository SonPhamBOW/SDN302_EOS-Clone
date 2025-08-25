import useAuthUser from "../../hooks/useAuthUser";
import ToogleThemeBtn from "../ToogleThemeBtn";

export const TopBar = () => {
  const { authUser } = useAuthUser();
  return (
    <div className="px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">
            🚀 Good day, {authUser?.name}!
          </span>
          <span className="text-xs block text-stone-500">
            {new Date().toLocaleDateString("vi-VN")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ToogleThemeBtn/>

          {/* <button className="flex text-sm text-base-content items-center gap-2 bg-base-300 transition-colors px-3 py-1.5 rounded">
            <FiCalendar />
            <span>Prev 6 Months</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};
