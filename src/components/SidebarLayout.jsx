import { Outlet } from "react-router-dom";

export default function SidebarLayout({ sidebar }) {
  return (
    <div className="flex h-screen">
      {sidebar}

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
