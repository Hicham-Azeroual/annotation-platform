import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import useThemeStore from '../../store/themeStore';

const Layout = () => {
  const { theme } = useThemeStore();

  return (
    <div className="flex min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <motion.main
          className="flex-1 overflow-y-auto p-6 bg-base-100"
          style={{ marginTop: '64px', marginBottom: '64px' }} // Adjust for fixed navbar and footer heights
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
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