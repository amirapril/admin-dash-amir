import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

/**
 * Shell shared by every authenticated page:
 * fixed sidebar + top navbar + scrollable content area (<Outlet />).
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <Topbar onMenuClick={() => setSidebarOpen((v) => !v)} />

        <main className="page-content">
          <Outlet />
        </main>

        <footer className="page-footer">
          © {new Date().getFullYear()} Novin Admin — built with React &amp; Bootstrap
        </footer>
      </div>
    </div>
  );
}
