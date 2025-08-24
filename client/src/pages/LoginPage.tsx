import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GiFireGem } from "react-icons/gi";
import { useNavigate } from "react-router";
import { signIn } from "../apis/Auth.api";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(signInData);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="border border-primary/25 flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left SignUp form side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col ">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <GiFireGem className="size-9 text-primary" />
            <span
              className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r
                from-primary to-secondary tracking-wider"
            >
              EOS_Web
            </span>
          </div>

          {/* Form SignIn */}
          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Welcome back</h2>
                <p className="text-sm opacity-70">
                  Continue your journey to improve your skills
                </p>
              </div>

              <div className="space-y-3">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="John@gmail.com"
                    className="input input-bordered w-full"
                    onChange={(e) =>
                      setSignInData({ ...signInData, email: e.target.value })
                    }
                    value={signInData.email}
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="*******"
                    required
                    onChange={(e) =>
                      setSignInData({ ...signInData, password: e.target.value })
                    }
                    value={signInData.password}
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </div>
            </div>

            <button className="btn btn-primary rounded-full" type="submit">
              {!isPending ? "Sign In" : "Signing In..."}
            </button>

            <p className="text-sm text-center">
              Don't have an acount ?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>

        {/* Right Signin form side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col gap-3 bg-primary/20 items-center max-lg:hidden">
          <img src="/i.png" alt="loginImg" className="w-full" />
          <p className="text-lg font-bold text-center">
            Take Exams Online, Build Your Skills
          </p>
          <p className="text-md text-center">
            Practice regularly, keep learning, and grow your knowledge
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
