import { useQuery } from "@tanstack/react-query";
import { getMe } from "../apis/Auth.api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getMe,
    retry: false,
  });

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.isError ? null : authUser?.data?.user,
  };
};

export default useAuthUser;
