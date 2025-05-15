import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiSliders,
  FiCheckCircle, FiActivity, FiXCircle, FiEye, FiHardDrive,
} from 'react-icons/fi';
import { Tilt } from 'react-tilt';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import Notification from '../components/common/Notification';
import { getTaskSummaryByAnnotator } from '../api/tasksService';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const StatsCard = ({ title, value, icon, color }) => {
  const { theme } = useThemeStore();

  const colorVariants = {
    primary: 'from-blue-600 to-teal-600',
    success: 'from-emerald-600 to-teal-600',
    warning: 'from-amber-600 to-orange-600',
  };

  const IconComponent = {
    completed: FiCheckCircle,
    inProgress: FiActivity,
  }[icon] || FiXCircle;

  const gradientColors = ['#2563EB', '#10B981', '#F59E0B'];

  return (
    <Tilt options={{ max: 15, scale: 1.05, perspective: 1000, glare: true, 'max-glare': 0.2 }}>
      <motion.div
        className={`relative bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-base-300 dark:border-base-content/10 hover:border-primary/30 transition-all overflow-hidden group`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        whileHover={{ y: -5 }}
      >
        <motion.div
          className="absolute left-0 top-0 w-1 h-full"
          animate={{ backgroundColor: gradientColors }}
          transition={{ backgroundColor: { duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' } }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundImage: [
              `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]})`,
              `linear-gradient(45deg, ${gradientColors[1]}, ${gradientColors[2]})`,
            ],
            opacity: [0.1, 0.15, 0.1],
            rotate: [0, 10, 0],
          }}
          transition={{
            backgroundImage: { duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
            opacity: { duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
            rotate: { duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
          }}
        />
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${colorVariants[color]} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.05 }}
          transition={{ delay: 0.2 }}
        />
        <div className={`absolute top-0 right-0 w-16 h-16 bg-${color}-500/10 rounded-bl-full transition-all duration-500 group-hover:w-20 group-hover:h-20`} />
        <div className="relative z-10 flex justify-between items-center h-full">
          <div>
            <p className="text-sm font-medium text-base-content/70 uppercase tracking-wider mb-1">{title}</p>
            <motion.p
              className="text-3xl font-bold text-base-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {value}
            </motion.p>
          </div>
          <motion.div
            className={`p-3 rounded-lg bg-${color}-500/10 backdrop-blur-sm`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            whileHover={{ rotate: 10 }}
          >
            <IconComponent size={24} className={`text-${color}-600`} />
          </motion.div>
        </div>
      </motion.div>
    </Tilt>
  );
};

const LinearProgressBar = ({ progress: rawProgress }) => {
  const { theme } = useThemeStore();
  const [annotated, total] = rawProgress.split('/').map(Number);
  const adjustedProgress = total > 0 ? (annotated === total - 1 ? 100 : (annotated / total) * 100) : 0;

  const formattedProgress = adjustedProgress.toFixed(2);

  const colors = {
    low: theme === 'dark' ? 'from-indigo-500 to-teal-500' : 'from-indigo-600 to-teal-600',
    medium: theme === 'dark' ? 'from-teal-500 to-purple-500' : 'from-teal-600 to-purple-600',
    high: theme === 'dark' ? 'from-purple-500 to-blue-500' : 'from-purple-600 to-blue-600',
  };

  const getGradient = () => {
    if (adjustedProgress <= 33) return colors.low;
    if (adjustedProgress <= 66) return colors.medium;
    return colors.high;
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-[150px]">
      <div className="relative flex-1 h-4 rounded-full overflow-hidden bg-base-300 dark:bg-base-200">
        <motion.div
          className={`absolute h-full rounded-full bg-gradient-to-r ${getGradient()}`}
          initial={{ width: 0 }}
          animate={{ width: `${adjustedProgress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.3),transparent,transparent)]"
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 5px rgba(79, 70, 229, 0.3)',
              '0 0 10px rgba(79, 70, 229, 0.5)',
              '0 0 5px rgba(79, 70, 229, 0.3)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <span className="text-xs font-medium text-base-content">{formattedProgress}%</span>
    </div>
  );
};

const DashboardUser = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'taskId',
    sortOrder: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const annotatorId = user?.id || null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['taskSummary', annotatorId],
    queryFn: () => getTaskSummaryByAnnotator(annotatorId),
    enabled: !!annotatorId,
  });

  console.log(data);

  const calculateStats = (data) => {
    if (!data?.data) return { total: 0, completed: 0, inProgress: 0 };
    const summaries = data.data;
    let total = summaries.length;
    let completed = 0;
    let inProgress = 0;

    summaries.forEach((summary) => {
      const [annotated, totalCoupeTextes] = summary.progress.split('/').map(Number);
      const progress = totalCoupeTextes > 0 ? (annotated === totalCoupeTextes - 1 ? 100 : (annotated / totalCoupeTextes) * 100) : 0;

      if (progress >= 100) completed++;
      else if (progress > 0) inProgress++;
    });

    return { total, completed, inProgress };
  };

  const { total, completed, inProgress } = calculateStats(data);

  const filteredTasks = data?.data
    ? data.data
        .filter((summary) => {
          const matchesSearch =
            summary.datasetName.toLowerCase().includes(searchTerm.toLowerCase());
          const [annotated, totalCoupeTextes] = summary.progress.split('/').map(Number);
          const progress = totalCoupeTextes > 0 ? (annotated === totalCoupeTextes - 1 ? 100 : (annotated / totalCoupeTextes) * 100) : 0;
          const matchesStatus =
            filters.status === 'all' ||
            (filters.status === 'completed' && progress >= 100) ||
            (filters.status === 'inProgress' && progress > 0 && progress < 100) ||
            (filters.status === 'unassigned' && progress === 0);
          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          const [annotatedA, totalA] = a.progress.split('/').map(Number);
          const [annotatedB, totalB] = b.progress.split('/').map(Number);
          const progressA = totalA > 0 ? (annotatedA === totalA - 1 ? 100 : (annotatedA / totalA) * 100) : 0;
          const progressB = totalB > 0 ? (annotatedB === totalB - 1 ? 100 : (annotatedB / totalB) * 100) : 0;

          if (filters.sortBy === 'taskId') {
            return filters.sortOrder === 'asc' ? a.tasks[0].taskId - b.tasks[0].taskId : b.tasks[0].taskId - a.tasks[0].taskId;
          } else if (filters.sortBy === 'datasetName') {
            return filters.sortOrder === 'asc'
              ? a.datasetName.localeCompare(b.datasetName)
              : b.datasetName.localeCompare(a.datasetName);
          } else if (filters.sortBy === 'progress') {
            return filters.sortOrder === 'asc' ? progressA - progressB : progressB - progressA;
          }
          return 0;
        })
    : [];

  const handleDetails = (taskId, datasetId) => {
    navigate(`/tasks/${annotatorId}/${datasetId}/0`); // Start at page 0
  };

  if (isLoading) return <Loading />;
  if (error) return <Notification message={error.message} type="error" onClose={() => {}} />;

  return (
    <motion.div
      className="min-h-screen pt-16 pb-16 pl-64 pr-6 space-y-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Annotator Dashboard
          </motion.h1>
          <motion.p
            className="text-base-content/70 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Manage and track your annotation tasks
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <StatsCard title="Total Tasks" value={total} icon="inProgress" color="primary" />
        <StatsCard title="Completed Tasks" value={completed} icon="completed" color="success" />
        <StatsCard title="In Progress Tasks" value={inProgress} icon="inProgress" color="warning" />
      </motion.div>

      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <motion.div
            className="relative flex-1 w-full"
            whileHover={{ y: -2 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-base-content/50" />
            </div>
            <input
              type="text"
              placeholder="Search tasks or datasets..."
              className="w-full pl-10 pr-4 py-3 bg-base-300 dark:bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base-content"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-3 bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 rounded-xl transition-colors text-base-content"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSliders className="mr-2" />
            Filters
            {showFilters ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
          </motion.button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mt-6 pt-6 border-t border-base-300/10 grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-base-content/70 mb-3">
                  Status
                </label>
                <div className="flex flex-wrap gap-3">
                  {['all', 'completed', 'inProgress', 'unassigned'].map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => setFilters({ ...filters, status })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        filters.status === status
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 text-base-content'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {status === 'inProgress'
                        ? 'In Progress'
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-base-content/70 mb-3">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    className="w-full pl-4 pr-10 py-2.5 bg-base-300 dark:bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none transition-all text-base-content"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  >
                    <option value="taskId">Task ID</option>
                    <option value="datasetName">Dataset Name</option>
                    <option value="progress">Progress</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="text-base-content/50" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-base-content/70 mb-3">
                  Order
                </label>
                <div className="flex gap-3">
                  {['asc', 'desc'].map((order) => (
                    <motion.button
                      key={order}
                      onClick={() => setFilters({ ...filters, sortOrder: order })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        filters.sortOrder === order
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 text-base-content'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {order === 'asc' ? 'Ascending' : 'Descending'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-6 border-b border-base-300/10 flex justify-between items-center bg-gradient-to-r from-primary/5 to-secondary/5">
          <motion.h2
            className="text-xl font-semibold flex items-center text-base-content drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Tasks List
          </motion.h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-gradient-to-r from-primary/20 to-secondary/20 text-base-content/90 text-sm shadow-md">
                <th className="w-[80px] p-4 text-left font-medium">
                  <FiCheckCircle size={16} className="inline mr-2 text-primary" />
                  Task ID
                </th>
                <th className="w-[200px] p-4 text-left font-medium">
                  <FiHardDrive size={16} className="inline mr-2 text-primary" />
                  Dataset Name
                </th>
                <th className="w-[300px] p-4 text-left font-medium">
                  <FiActivity size={16} className="inline mr-2 text-primary" />
                  Description
                </th>
                <th className="w-[200px] p-4 text-left font-medium">
                  <FiActivity size={16} className="inline mr-2 text-primary" />
                  Progress
                </th>
                <th className="w-[150px] p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/10">
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="5" className="p-8 text-center text-base-content/70">
                      No tasks found matching your criteria.
                    </td>
                  </motion.tr>
                ) : (
                  filteredTasks.map((task, index) => {
                    const [annotated, total] = task.progress.split('/').map(Number);
                    const progress = total > 0 ? (annotated === total - 1 ? 100 : (annotated / total) * 100) : 0;
                    return (
                      <motion.tr
                        key={task.datasetId}
                        className={`transition-all duration-300 ${
                          index % 2 === 0
                            ? 'bg-base-200/30 dark:bg-base-100/30'
                            : 'bg-base-200/50 dark:bg-base-100/50'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.7 + index * 0.1, type: 'spring', stiffness: 80 },
                        }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{
                          backgroundImage:
                            'linear-gradient(to right, rgba(34, 211, 238, 0.1), rgba(217, 70, 239, 0.1))',
                          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                          transition: { duration: 0.3 },
                        }}
                      >
                        <td className="w-[80px] p-4 font-mono text-primary truncate">{task.tasks[0].taskId}</td>
                        <td className="w-[200px] p-4 font-medium text-base-content truncate">
                          {task.datasetName}
                        </td>
                        <td className="w-[300px] p-4 text-base-content truncate">
                          {task.description}
                        </td>
                        <td className="w-[200px] p-4">
                          <LinearProgressBar progress={task.progress} />
                        </td>
                        <td className="w-[150px] p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              onClick={() => handleDetails(task.tasks[0].taskId, task.datasetId)}
                              className="p-2 rounded-lg bg-info/20 text-info hover:bg-info/30 transition-colors"
                              whileHover={{
                                scale: 1.2,
                                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                              }}
                              whileTap={{ scale: 0.9 }}
                              title="Details"
                            >
                              <FiEye size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardUser;