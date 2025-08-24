import type { ReactNode } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { TopBar } from "../../components/admin/TopBar";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const AdminLayout = ({ children, showSidebar = false }: LayoutProps) => {
  return (
    <div className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
      {showSidebar && <Sidebar />}

      <div className="rounded-lg pb-4 shadow">
        <TopBar />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
