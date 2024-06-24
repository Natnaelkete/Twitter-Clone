import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import RightPanel from "../components/common/RightPanel";

function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
      <RightPanel />
    </div>
  );
}

export default AppLayout;
