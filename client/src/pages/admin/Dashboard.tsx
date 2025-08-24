import { Grid } from "../../components/admin/Grid";
import Sidebar from "../../components/admin/Sidebar";
import { TopBar } from "../../components/admin/TopBar";

const Dashboard = () => {
  return (
    <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
      <Sidebar />
      <div className=" rounded-lg pb-4 shadow">
        <TopBar />
        <Grid />
      </div>
    </main>
  );
};

export default Dashboard;
