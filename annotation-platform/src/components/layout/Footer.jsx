import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      className="bg-base-100 border-t border-base-200 p-4 shadow-sm fixed bottom-0 left-64 right-0 z-20"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-base-content opacity-70 text-sm mb-2 md:mb-0">
          © {new Date().getFullYear()} Annotation Platform. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <motion.a
            href="#"
            className="text-base-content opacity-70 hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Terms
          </motion.a>
          <motion.a
            href="#"
            className="text-base-content opacity-70 hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Privacy
          </motion.a>
          <motion.a
            href="#"
            className="text-base-content opacity-70 hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Contact
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;