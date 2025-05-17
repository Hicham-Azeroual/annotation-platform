import { motion } from "framer-motion";
import {
  FiDatabase,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

const DatasetProgressCircles = ({ data }) => {
  // Calculate total statistics
  const totalDatasets = data.length;
  const totalCompleted = data.reduce(
    (sum, dataset) => sum + dataset.completed,
    0
  );
  const totalPending = data.reduce((sum, dataset) => sum + dataset.pending, 0);
  const totalItems = totalCompleted + totalPending;
  const completionRate =
    totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0;

  const stats = [
    {
      title: "Total Datasets",
      value: totalDatasets,
      icon: FiDatabase,
      color: "from-primary to-secondary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Completed Items",
      value: totalCompleted,
      icon: FiCheckCircle,
      color: "from-success to-emerald-400",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending Items",
      value: totalPending,
      icon: FiClock,
      color: "from-warning to-amber-400",
      bgColor: "bg-warning/10",
    },
    {
      title: "Completion Rate",
      value: `${completionRate.toFixed(1)}%`,
      icon: FiAlertCircle,
      color: "from-info to-cyan-400",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-base-100 dark:bg-base-200 rounded-xl p-6 shadow-lg border border-base-300/20"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10">
          <FiDatabase className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-base-content">
          Dataset Progress Overview
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex flex-col items-center">
              <div
                className={`relative w-32 h-32 ${stat.bgColor} rounded-full flex items-center justify-center`}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r opacity-20 animate-pulse" />
                <div className="relative z-10 flex flex-col items-center">
                  <stat.icon
                    className={`w-8 h-8 mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-sm text-base-content/70 mt-1">
                    {stat.title}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dataset List */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">Dataset Details</h4>
        <div className="space-y-4">
          {data.map((dataset, index) => (
            <motion.div
              key={dataset.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-base-200/50 dark:bg-base-100/50 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{dataset.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-success text-sm">
                    {dataset.completed} completed
                  </span>
                  <span className="text-warning text-sm">
                    {dataset.pending} pending
                  </span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-base-300/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      ((dataset.completed + dataset.pending) / totalItems) * 100
                    }%`,
                  }}
                  transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DatasetProgressCircles;
