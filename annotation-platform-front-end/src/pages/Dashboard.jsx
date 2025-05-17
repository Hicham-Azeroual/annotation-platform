import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { FiPlus, FiUpload, FiUserPlus, FiBarChart2 } from "react-icons/fi";
import { getStatistics } from "../api/statisticsService";
import Loading from "../components/common/Loading";
import Notification from "../components/common/Notification";
import { FiClock } from "react-icons/fi";
import StatsCard from "../features/dashboard/StatsCard";
import RecentActivity from "../features/dashboard/RecentActivity";
import ProgressChart from "../features/dashboard/ProgressChart";
import AnnotationTrendChart from "../features/dashboard/AnnotationTrendChart";
import TopAnnotators from "../features/dashboard/TopAnnotators";
import QuickActionButton from "../features/dashboard/QuickActionButton";
import DatasetDonutChart from "../features/dashboard/DatasetDonutChart";

const Dashboard = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistics,
  });

  if (isLoading) return <Loading />;
  if (error)
    return (
      <Notification message={error.message} type="error" onClose={() => {}} />
    );

  const stats = data?.data?.stats || [];
  const activities = data?.data?.activities || [];
  const topAnnotators = data?.data?.topAnnotators || [];
  const datasetsProgress = data?.data?.datasetsProgress || [];
  const annotationTrend = data?.data?.annotationTrend || [];

  const quickActions = [
    { icon: FiPlus, label: "New Dataset", color: "primary" },
    { icon: FiUpload, label: "Import Data", color: "secondary" },
    { icon: FiUserPlus, label: "Add Annotator", color: "accent" },
    { icon: FiBarChart2, label: "View Reports", color: "neutral" },
  ];

  return (
    <motion.div
      className="min-h-screen space-y-4 sm:space-y-6 md:space-y-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Dashboard Overview
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base text-base-content/70 mt-1 sm:mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome back! Here's what's happening with your platform.
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </motion.div>

      {/* Dataset Distribution Chart (Moved to left column) */}
      {/* Remove DatasetDonutChart from here */}
      {/* <DatasetDonutChart data={datasetsProgress} /> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <motion.div
          className="lg:col-span-2 space-y-4 sm:space-y-6 flex flex-col"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnnotationTrendChart annotationTrend={annotationTrend} />
          {/* Place DatasetDonutChart here */}
          <DatasetDonutChart data={datasetsProgress} />
        </motion.div>

        {/* Right Column */}
        <motion.div
          className="space-y-4 sm:space-y-6 flex flex-col"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <TopAnnotators annotators={topAnnotators} />
          {/* Recent Activity remains in Right Column */}
          <RecentActivity activities={activities} />
          <motion.div
            className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-base-content flex items-center">
              <FiClock className="mr-2 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={action.label}
                  icon={action.icon}
                  label={action.label}
                  color={action.color}
                  delay={0.9 + index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
