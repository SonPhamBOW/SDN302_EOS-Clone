import { StatCards } from "./StatCards";
import { ActivityGraph } from "./ActivityGraph";
import { UsageRadar } from "./UsageRadar";
import { RecentTransactions } from "./RecentTransactions";

export const Grid = () => {
  return (
    <div className="h-screen overflow-y-scroll pb-28">
      <div className="px-4 grid gap-3 grid-cols-12">
        <StatCards />
        <ActivityGraph />
        <UsageRadar />
        <RecentTransactions />
      </div>
    </div>
  );
};
