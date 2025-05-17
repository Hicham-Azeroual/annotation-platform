import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiList,
  FiFileText,
  FiClock,
  FiSettings,
  FiDatabase,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import useAuthStore from "../../store/authStore";

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuthStore();

  // Define navigation items based on role
  const userNavItems = [
    { path: "/dashboard-user", icon: <FiHome size={20} />, label: "Dashboard" },
    { path: "/tasks", icon: <FiList size={20} />, label: "Tasks" },
    { path: "/my-work", icon: <FiFileText size={20} />, label: "My Work" },
    { path: "/history", icon: <FiClock size={20} />, label: "History" },
    {
      path: "/settings-user",
      icon: <FiSettings size={20} />,
      label: "Settings",
    },
  ];

  const adminNavItems = [
    { path: "/dashboard", icon: <FiHome size={20} />, label: "Dashboard" },
    { path: "/datasets", icon: <FiDatabase size={20} />, label: "Datasets" },
    { path: "/annotators", icon: <FiUsers size={20} />, label: "Annotators" },
    {
      path: "/statistics",
      icon: <FiBarChart2 size={20} />,
      label: "Statistics",
    },
    { path: "/settings", icon: <FiSettings size={20} />, label: "Settings" },
  ];

  const navItems = user?.role === "ADMIN" ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await logout();
  };

  const textColors = [
    "#22D3EE", // Cyan
    "#D946EF", // Magenta
    "#3B82F6", // Electric Blue
    "#4ADE80", // Neon Green
    "#F472B6", // Hot Pink
    "#8B5CF6", // Violet
    "#22D3EE", // Loop back to Cyan
  ];

  return (
    <motion.div
      className="flex flex-col w-64 h-screen bg-base-100/10 dark:bg-base-100/5 backdrop-blur-xl shadow-[4px_0_15px_-3px_rgba(0,0,0,0.1)]"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header with Logo and Name */}
      <div className="p-4 border-b border-base-200/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            className="relative w-12 h-12 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden shadow-lg"
            initial={{ scale: 0, rotateY: 90, translateZ: -20 }}
            animate={{ scale: 1, rotateY: 0, translateZ: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            whileHover={{
              rotateX: 10,
              rotateY: 10,
              translateZ: 10,
              boxShadow: "0 0 20px rgba(34, 211, 238, 0.6)",
              transition: { duration: 0.3 },
            }}
          >
            <img
              src="https://cdn.qwenlm.ai/output/3bea37d4-842a-435c-8c29-915e2630a0e5/t2i/07335431-33a9-4300-9e49-34694daded78/3aa388f6-63ff-48e6-bdc1-03569e0366d1.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiM2JlYTM3ZDQtODQyYS00MzVjLThjMjktOTE1ZTI2MzBhMGU1IiwicmVzb3VyY2VfaWQiOiIzYWEzODhmNi02M2ZmLTQ4ZTYtYmRjMS0wMzU2OWUwMzY2ZDEiLCJyZXNvdXJjZV9jaGF0X2lkIjpudWxsfQ.6LGO_gvtlrSAbj1bU90gAWq1cDsKd0h3VF9G7yUWUwY"
              alt="Nexlify Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <motion.h1
            className="text-xl font-bold"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{
              rotateX: 5,
              rotateY: 5,
              translateZ: 5,
              transition: { duration: 0.3 },
            }}
            style={{ color: "#22D3EE" }}
          >
            <motion.span
              animate={{
                color: textColors,
              }}
              transition={{
                color: {
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                },
              }}
            >
              Nexlify
            </motion.span>
          </motion.h1>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-2 text-base-content hover:text-primary transition-colors"
          aria-label="Close menu"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Navigation and User Section Container */}
      <div className="flex flex-col flex-1 justify-between overflow-y-auto">
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-md"
                      : "text-base-content/80 hover:bg-base-200/30 hover:text-primary"
                  }`
                }
              >
                <motion.span
                  className="mr-3"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon}
                </motion.span>
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User Profile and Logout */}
        <div className="p-4 border-t border-base-200/30 space-y-4">
          <motion.div
            className="flex items-center bg-base-200/10 p-3 rounded-lg shadow-inner"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{
              rotateX: 5,
              rotateY: 5,
              boxShadow: "0 5px 15px rgba(34, 211, 238, 0.2)",
              transition: { duration: 0.3 },
            }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <span className="font-bold text-white">
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </span>
            </motion.div>
            <div className="ml-3">
              <p className="font-semibold text-base-content">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-base-content/70">
                {user?.role || "User"}
              </p>
            </div>
          </motion.div>

          <motion.button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-all duration-300"
            whileHover={{ x: 5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLogOut className="mr-3" size={20} />
            <span className="font-semibold">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
