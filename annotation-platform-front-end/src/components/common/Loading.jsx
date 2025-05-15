import { motion } from 'framer-motion';
import useTheme from '../../hooks/useTheme'; // Assuming the useTheme hook is in a hooks folder

const Loading = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <motion.div
      className="flex justify-center items-center h-screen bg-base-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </motion.div>
  );
};

export default Loading;