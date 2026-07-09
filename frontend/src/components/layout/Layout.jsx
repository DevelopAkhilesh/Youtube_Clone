import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { useState } from "react";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar isOpen={sidebarOpen} />
        <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;