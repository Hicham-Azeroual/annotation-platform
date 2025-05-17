import { motion, AnimatePresence } from "framer-motion";
import { FiActivity, FiClock } from "react-icons/fi";
import DatasetDonutChart from "./DatasetDonutChart";

const ActivityAndDatasetChart = ({ activities, datasetsProgress }) => (
  <motion.div
    className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-base-300 dark:border-base-content/10 flex flex-col lg:flex-row gap-6"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    {/* Activity List */}
    <div className="flex-1 min-w-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-base-content flex items-center">
        <FiActivity className="mr-2 text-primary" />
        Recent Activity
      </h2>
      <div className="space-y-3 sm:space-y-4">
        <AnimatePresence>
          {activities.length === 0 ? (
            <p className="text-sm sm:text-base text-base-content/70">
              No recent activities.
            </p>
          ) : (
            activities.map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-start group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-success"
                        : activity.type === "error"
                        ? "bg-error"
                        : "bg-primary"
                    }`}
                  ></div>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-base-content group-hover:text-primary transition-colors">
                    {activity.message}
                  </p>
                  <p className="text-[10px] sm:text-xs text-base-content/70 flex items-center">
                    <FiClock className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
    {/* Divider for desktop */}
    <div className="hidden lg:block w-px bg-base-300/30 mx-2" />
    {/* Donut Chart */}
    <div className="flex flex-col items-center justify-center lg:w-80 w-full">
      <DatasetDonutChart data={datasetsProgress} compact />
    </div>
  </motion.div>
);

export default ActivityAndDatasetChart;
