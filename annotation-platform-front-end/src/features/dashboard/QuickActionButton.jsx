import { motion } from "framer-motion";

const QuickActionButton = ({ icon: Icon, label, color, delay }) => {
  const colorClasses = {
    primary: "bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary",
    secondary:
      "bg-secondary/10 hover:bg-secondary/20 border-secondary/20 text-secondary",
    accent: "bg-accent/10 hover:bg-accent/20 border-accent/20 text-accent",
    neutral: "bg-neutral/10 hover:bg-neutral/20 border-neutral/20 text-neutral",
  };

  return (
    <motion.button
      className={`flex flex-col items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl border transition-all text-xs sm:text-sm ${colorClasses[color]}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={18} className="mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />
      <span>{label}</span>
    </motion.button>
  );
};

export default QuickActionButton;
