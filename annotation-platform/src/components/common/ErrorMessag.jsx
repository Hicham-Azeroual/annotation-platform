import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message, error, retryFn }) => {
  return (
    <motion.div
      className="bg-error/10 border border-error/30 rounded-xl p-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start">
        <FiAlertCircle className="text-error mt-1 mr-3 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-medium text-error mb-2">{message}</h3>
          <p className="text-base-content/70 mb-4">{error?.message || 'Unknown error occurred'}</p>
          <button
            onClick={retryFn}
            className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;