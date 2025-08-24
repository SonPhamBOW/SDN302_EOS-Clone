import { useState } from "react";
import { GiFireGem } from "react-icons/gi";
import { useNavigate } from "react-router";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [signupData, setsignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
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

          {/* Form Signup */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Create an Account</h2>
                <p className="text-sm opacity-70">
                  Join SoChat and start your language learning adventure
                </p>
              </div>

              <div className="space-y-3">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input input-bordered w-full"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setsignupData({
                        ...signupData,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="John@gmail.com"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={(e) =>
                      setsignupData({
                        ...signupData,
                        email: e.target.value,
                      })
                    }
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
                    value={signupData.password}
                    onChange={(e) =>
                      setsignupData({
                        ...signupData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </div>
            </div>

            {/* Term confirmation */}
            <div className="w-full flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                required
              />
              <p className="text-sm">
                I agree to the{" "}
                <span className="text-primary cursor-pointer">
                  term of services
                </span>{" "}
                and{" "}
                <span className="text-primary cursor-pointer">
                  privacy prolicy
                </span>
              </p>
            </div>

            <button className="btn btn-primary rounded-full" type="submit">
              Create Account
            </button>

            <p className="text-sm text-center">
              Already have an acount ?{" "}
              <span className="text-primary cursor-pointer" onClick={() => navigate('/login')}>Sign in</span>
            </p>
          </form>
        </div>

        {/* Right SignUp form side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col gap-3 bg-primary/30 items-center max-lg:hidden">
          <img src="/i.png" alt="loginImg" className="w-full" />
          <p className="text-lg font-bold">Connect with partner Worldwide</p>
          <p className="text-md text-center">
            Practice conversations, make friends and improve your language
            skills together
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
