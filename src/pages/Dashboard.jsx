import React from "react";
import { Outlet, useMatches } from "react-router";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  // const matches = useMatches(); // Only Using With Data Router to Access Route Handles
  // const currentMatch = matches[matches.length - 1];
  // const title = currentMatch?.handle?.title || "Dashboard"; 

  return (
    <div className="pt-20 min-h-screen flex flex-col">

      {/* Layout */}
      <div className="md:flex gap-4 w-[95%] mx-auto flex-1">
        <Sidebar />

        {/* Content Area */}
        <div className="flex-1 rounded-2xl py-2 overflow-y-auto ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
