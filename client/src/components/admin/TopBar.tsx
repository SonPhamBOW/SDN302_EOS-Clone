import { FiCalendar } from "react-icons/fi";
import ThemeSelector from "../student/ThemeSelector";

export const TopBar = () => {
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">🚀 Good morning, Tom!</span>
          <span className="text-xs block text-stone-500">
            Tuesday, Aug 8th 2023
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSelector />

          <button className="flex text-sm text-base-content items-center gap-2 bg-base-300 transition-colors px-3 py-1.5 rounded">
            <FiCalendar />
            <span>Prev 6 Months</span>
          </button>
        </div>
      </div>
    </div>
  );
};
