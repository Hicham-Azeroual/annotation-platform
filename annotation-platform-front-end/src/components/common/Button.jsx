import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Button = ({ children, onClick, className, disabled, type = 'button' }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={clsx(
        'btn btn-primary rounded-full px-6 py-3 text-white font-semibold shadow-lg',
        className,
        disabled && 'btn-disabled opacity-50 cursor-not-allowed'
      )}
      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

export default Button;