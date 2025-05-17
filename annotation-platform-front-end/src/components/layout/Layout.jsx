import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useThemeStore from "../../store/themeStore";

const Layout = () => {
  const { theme } = useThemeStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar onMenuClick={toggleSidebar} />
        <motion.main
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-base-100"
          style={{ marginTop: "64px", marginBottom: "64px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
