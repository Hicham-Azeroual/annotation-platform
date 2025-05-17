import { motion } from 'framer-motion';
import { FiMenu, FiBell, FiSearch, FiSun, FiMoon, FiX } from 'react-icons/fi';
import useThemeStore from '../../store/themeStore';
import useAuthStore from '../../store/authStore';

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <motion.header
      className="bg-base-100 border-b border-base-200 p-4 shadow-sm fixed top-0 left-0 right-0 md:left-64 z-30"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden text-base-content hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            <FiMenu size={24} />
          </button>
          <div className="relative hidden md:block">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-base-200 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Mobile Search */}
          <div className="md:hidden relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-base-200 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary w-40 transition-colors"
            />
          </div>

          <motion.button
            className="relative p-2 text-base-content hover:text-primary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiBell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <motion.button
            onClick={toggleTheme}
            className="p-2 text-base-content hover:text-primary rounded-full bg-base-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </motion.button>

          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="font-bold text-sm text-white">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;