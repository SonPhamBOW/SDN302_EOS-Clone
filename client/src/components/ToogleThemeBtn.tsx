import { MoonIcon, SunDimIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ToogleThemeBtn = () => {
  const { setTheme } = useThemeStore();
  return (
    <div className="flex">
      <label className="swap swap-rotate ">
        <input type="checkbox" />

        <SunDimIcon
          className="size-5 swap-on"
          onClick={() => setTheme("forest")}
        />

        <MoonIcon
          className="size-5 swap-off"
          onClick={() => setTheme("cupcake")}
        />
      </label>
    </div>
  );
};

export default ToogleThemeBtn;
