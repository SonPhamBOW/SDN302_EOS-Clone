import { AccountToggle } from "./AccountToggle";
import { Plan } from "./Plan";
import { RouteSelect } from "./RouteSelect";
import { Search } from "./Search";

const Sidebar = () => {
  return (
    <div>
      <div className=" sticky top-4 h-[calc(100vh-32px-48px)]">
        <AccountToggle />
        <Search />
        <RouteSelect />
      </div>

      <Plan />
    </div>
  );
};

export default Sidebar;
