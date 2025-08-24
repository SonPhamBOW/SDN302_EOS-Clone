import { UserIcon} from "lucide-react";
import { Link } from "react-router";

const Homepage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 overflow-auto max-h-screen">
      <div className="container mx-auto space-y-10">
        <div
          className="flex flex-col sm:flex-row items-start 
        sm:items-center justify-between gap-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to={"/notifications"} className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

      </div>

      <div className="container mx-auto space-y-10">
        <div
          className="flex flex-col items-start 
         gap-2"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Meet new learners
          </h2>
          <p className="text-sm tracking-tight">
            Discover perfect language exchange partners based on your profile
          </p>
        </div>

      </div>
    </div>
  )
}

export default Homepage