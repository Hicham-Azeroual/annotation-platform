import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={clsx(
        'fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg text-white z-50 m-auto',
        type === 'error' ? 'bg-error' : 'bg-success'
      )}
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      {message}
    </motion.div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;