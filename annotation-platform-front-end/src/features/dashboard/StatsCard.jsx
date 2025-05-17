import { motion } from "framer-motion";
import {
  FiDatabase,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiActivity,
  FiClock,
  FiAward,
} from "react-icons/fi";
import useThemeStore from "../../store/themeStore";

const StatsCard = ({ title, value, change, icon, delay = 0 }) => {
  const { theme } = useThemeStore();
  const IconComponent =
    {
      database: FiDatabase,
      users: FiUsers,
      "check-circle": FiCheckCircle,
      "trending-up": FiTrendingUp,
      activity: FiActivity,
      clock: FiClock,
      award: FiAward,
    }[icon] || FiDatabase;

  const gradientColors = [
    "#22D3EE",
    "#D946EF",
    "#3B82F6",
    "#4ADE80",
    "#F472B6",
    "#8B5CF6",
    "#22D3EE",
  ];

  return (
    <motion.div
      className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10 hover:border-primary/30 transition-all relative overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -5,
        boxShadow:
          theme === "dark"
            ? "0 10px 25px -5px rgba(34, 211, 238, 0.1)"
            : "0 10px 25px -5px rgba(6, 182, 212, 0.1)",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundImage: [
            `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]})`,
            `linear-gradient(45deg, ${gradientColors[1]}, ${gradientColors[2]})`,
            `linear-gradient(45deg, ${gradientColors[2]}, ${gradientColors[3]})`,
            `linear-gradient(45deg, ${gradientColors[3]}, ${gradientColors[4]})`,
            `linear-gradient(45deg, ${gradientColors[4]}, ${gradientColors[5]})`,
            `linear-gradient(45deg, ${gradientColors[5]}, ${gradientColors[6]})`,
          ],
          opacity: [0.1, 0.15, 0.1],
          rotate: [0, 10, 0],
        }}
        transition={{
          backgroundImage: {
            duration: 12,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          },
          opacity: {
            duration: 12,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          },
          rotate: {
            duration: 12,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          },
        }}
      />

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-base-content/70 text-xs sm:text-sm font-medium">
            {title}
          </p>
          <motion.p
            className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          <motion.p
            className={`text-xs sm:text-sm mt-1 flex items-center ${
              change.startsWith("+") ? "text-success" : "text-error"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {change.startsWith("+") ? (
              <FiTrendingUp className="mr-1" />
            ) : (
              <FiTrendingUp className="mr-1 transform rotate-180" />
            )}
            {change}
          </motion.p>
        </div>
        <motion.div
          className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1 }}
          whileHover={{ rotate: 10 }}
        >
          <IconComponent size={20} className="text-primary sm:w-6 sm:h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
