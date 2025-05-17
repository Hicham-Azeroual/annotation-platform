import { motion, AnimatePresence } from 'framer-motion';
import { FiXCircle } from 'react-icons/fi';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-base-100 rounded-2xl p-8 shadow-2xl border border-error/20 max-w-md w-full relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <motion.div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-error/10 blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <div className="relative z-10">
              <div className="text-center">
                <motion.div
                  className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-error/10 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <FiXCircle size={32} className="text-error" />
                </motion.div>
                
                <motion.h3
                  className="text-xl font-bold text-base-content mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Confirm Deactivation
                </motion.h3>
                
                <motion.p
                  className="text-base-content/70 mb-6"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Are you sure you want to deactivate this annotator? This action cannot be undone.
                </motion.p>
                
                <motion.div
                  className="flex justify-center space-x-3"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-base-200 text-base-content hover:bg-base-300 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={onConfirm}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-error to-error-dark text-white shadow-lg hover:shadow-error/30 transition-all"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3)'
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Deactivate
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;