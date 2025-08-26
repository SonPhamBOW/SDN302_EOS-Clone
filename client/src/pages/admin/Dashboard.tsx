import { Grid } from "../../components/admin/Grid";
import { Link } from "react-router";

const Dashboard = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin dashboard</h2>
        <Link to="/admin/results" className="btn btn-primary btn-sm">Manage results</Link>
      </div>
      <Grid />
    </div>
  );
};

export default Dashboard;
