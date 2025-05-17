import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-base-100 border-t border-base-200 p-4 shadow-sm fixed bottom-0 left-0 right-0 md:left-64 z-20"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-base-content opacity-70 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Annotation Platform. All rights
            reserved.
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <motion.a
              href="#"
              className="text-base-content opacity-70 hover:text-primary transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#"
              className="text-base-content opacity-70 hover:text-primary transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="text-base-content opacity-70 hover:text-primary transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
