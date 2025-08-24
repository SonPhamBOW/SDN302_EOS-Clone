import { Link, useLocation } from "react-router";
// import useAuthUser from "../hooks/useAuthUser";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShipWheelIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import ThemeSelector from "./ThemeSelector";
import useAuthUser from "../../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "../../apis/Auth.api";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const curentPath = location.pathname;

  const isChatPage = curentPath === "/chat" ? true : false;

  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      console.log("Logout success");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSignOut = () => {
    logoutMutation();
  };

  return (
    <div
      className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16
  flex items-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 justify-end w-full">
          {isChatPage && (
            <div className="pl-5">
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
          )}

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to={"/notification"}>
              <button className="btn btn-ghost btn-circle">
                <DynamicIcon
                  name={"bell"}
                  className="size-4 text-base-content opacity-70"
                />
              </button>
            </Link>
          </div>

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full cursor-pointer">
              <img src={authUser?.avatarUrl} alt="" rel="noreferrer" />
            </div>
          </div>

          <button className="btn btn-ghost btn-circle" onClick={handleSignOut}>
            <DynamicIcon
              name={"log-out"}
              className="size-4 text-base-content opacity-70"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
