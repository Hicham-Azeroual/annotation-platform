import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { FiUsers, FiCheckCircle, FiXCircle } from "react-icons/fi";

const StatsCard = ({ title, value, icon, color }) => {
  const colorVariants = {
    primary: "from-primary to-secondary",
    success: "from-emerald-500 to-teal-500",
    error: "from-rose-500 to-pink-500",
    warning: "from-amber-500 to-orange-500",
    info: "from-sky-500 to-blue-500",
  };

  const IconComponent =
    {
      users: FiUsers,
      active: FiCheckCircle,
      inactive: FiXCircle,
    }[icon] || FiUsers;

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
    <Tilt
      options={{
        max: 15,
        scale: 1.05,
        perspective: 1000,
        glare: true,
        "max-glare": 0.2,
      }}
    >
      <motion.div
        className="relative bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10 hover:border-primary/30 transition-all overflow-hidden group"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        whileHover={{ y: -5 }}
      >
        <motion.div
          className="absolute left-0 top-0 w-1 h-full"
          animate={{ backgroundColor: gradientColors }}
          transition={{
            backgroundColor: {
              duration: 12,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
          }}
        />

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

        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${colorVariants[color]} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.05 }}
          transition={{ delay: 0.2 }}
        />

        <div
          className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-${color}-500/10 rounded-bl-full transition-all duration-500 group-hover:w-16 group-hover:h-16 sm:group-hover:w-20 sm:group-hover:h-20`}
        />

        <div className="relative z-10 flex justify-between items-center h-full">
          <div>
            <p className="text-xs sm:text-sm font-medium text-base-content/70 uppercase tracking-wider mb-1">
              {title}
            </p>
            <motion.p
              className="text-2xl sm:text-3xl font-bold text-base-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {value}
            </motion.p>
          </div>
          <motion.div
            className={`p-2 sm:p-3 rounded-lg bg-${color}-500/10 backdrop-blur-sm`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            whileHover={{ rotate: 10 }}
          >
            <IconComponent
              size={20}
              className={`text-${color}-600 sm:w-6 sm:h-6`}
            />
          </motion.div>
        </div>
      </motion.div>
    </Tilt>
  );
};

export default StatsCard;
