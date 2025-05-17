import { motion, AnimatePresence } from "framer-motion";
import { FiAward } from "react-icons/fi";
import { Link } from "react-router-dom";

const TopAnnotators = ({ annotators }) => {
  return (
    <motion.div
      className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-base-content flex items-center">
        <FiAward className="mr-2 text-primary" />
        Top Annotators
      </h2>
      <div className="space-y-3 sm:space-y-4">
        <AnimatePresence>
          {annotators.length === 0 ? (
            <p className="text-sm sm:text-base text-base-content/70">
              No annotators available.
            </p>
          ) : (
            annotators.map((annotator, index) => (
              <motion.div
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {index + 1}
                </motion.div>
                <div className="ml-3 sm:ml-4 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-base-content">
                    {annotator.name}
                  </p>
                  <div className="w-full bg-base-300 dark:bg-base-200 rounded-full h-1.5 sm:h-2 mt-1 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-secondary h-1.5 sm:h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${annotator.completion}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4 text-xs sm:text-sm text-primary font-medium">
                  {annotator.completion}%
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="mt-4 sm:mt-6 flex justify-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Link
          to="/annotators"
          className="btn btn-primary btn-xs sm:btn-sm rounded-full text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
        >
          Voir tout
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default TopAnnotators;
