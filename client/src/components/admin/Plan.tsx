import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "../../apis/Auth.api";

export const Plan = () => {
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
    <div className="flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs">
      <button
        className="px-2 py-1.5 font-medium bg-base-content text-base-100 hover:bg-stone-300 transition-colors rounded"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
};
