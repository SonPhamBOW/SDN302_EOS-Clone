import { Link } from "react-router";

const Homepage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 overflow-auto max-h-screen">
      <div className="container mx-auto space-y-10">
        <div
          className="flex flex-col sm:flex-row items-start 
        sm:items-center justify-between gap-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Student dashboard</h2>
          <div className="flex gap-2">
            <Link to={"/student/stats"} className="btn btn-primary btn-sm">My statistics</Link>
            <Link to={"/student/available-exams"} className="btn btn-outline btn-sm">Available exams</Link>
          </div>
        </div>

      </div>

      <div className="container mx-auto space-y-10">
        <div
          className="flex flex-col items-start 
         gap-2"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome</h2>
          <p className="text-sm tracking-tight">Use the shortcuts above to view your exam statistics or join available exams.</p>
        </div>

      </div>
    </div>
  )
}

export default Homepage