import { motion, AnimatePresence } from 'framer-motion';
import { FiDatabase, FiUsers, FiCheckCircle, FiTrendingUp, FiActivity, FiClock, FiAward, FiPlus, FiUpload, FiUserPlus, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line, Label } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import useThemeStore from '../store/themeStore';
import { getStatistics } from '../api/statisticsService';
import Loading from '../components/common/Loading';
import Notification from '../components/common/Notification';

const StatsCard = ({ title, value, change, icon, delay = 0 }) => {
  const { theme } = useThemeStore();
  const IconComponent = {
    'database': FiDatabase,
    'users': FiUsers,
    'check-circle': FiCheckCircle,
    'trending-up': FiTrendingUp,
    'activity': FiActivity,
    'clock': FiClock,
    'award': FiAward
  }[icon] || FiDatabase;

  const gradientColors = [
    '#22D3EE', // Cyan
    '#D946EF', // Magenta
    '#3B82F6', // Electric Blue
    '#4ADE80', // Neon Green
    '#F472B6', // Hot Pink
    '#8B5CF6', // Violet
    '#22D3EE'  // Loop back to Cyan
  ];

  return (
    <motion.div
      className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-base-300 dark:border-base-content/10 hover:border-primary/30 transition-all relative overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -5,
        boxShadow: theme === 'dark' ? '0 10px 25px -5px rgba(34, 211, 238, 0.1)' : '0 10px 25px -5px rgba(6, 182, 212, 0.1)'
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
            `linear-gradient(45deg, ${gradientColors[5]}, ${gradientColors[6]})`
          ],
          opacity: [0.1, 0.15, 0.1],
          rotate: [0, 10, 0]
        }}
        transition={{
          backgroundImage: { duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
          opacity: { duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
          rotate: { duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }
        }}
      />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-base-content/70 text-sm font-medium">{title}</p>
          <motion.p 
            className="text-3xl font-bold mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          <motion.p 
            className={`text-sm mt-1 flex items-center ${change.startsWith('+') ? 'text-success' : 'text-error'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {change.startsWith('+') ? (
              <FiTrendingUp className="mr-1" />
            ) : (
              <FiTrendingUp className="mr-1 transform rotate-180" />
            )}
            {change}
          </motion.p>
        </div>
        <motion.div 
          className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1 }}
          whileHover={{ rotate: 10 }}
        >
          <IconComponent size={24} className="text-primary" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const RecentActivity = ({ activities }) => {
  return (
    <motion.div 
      className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-base-300 dark:border-base-content/10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-base-content flex items-center">
        <FiActivity className="mr-2 text-primary" />
        Recent Activity
      </h2>
      <div className="space-y-4">
        <AnimatePresence>
          {activities.length === 0 ? (
            <p className="text-base-content/70">No recent activities.</p>
          ) : (
            activities.map((activity, index) => (
              <motion.div 
                key={index}
                className="flex items-start group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-success' : activity.type === 'error' ? 'bg-error' : 'bg-primary'}`}></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-base-content group-hover:text-primary transition-colors">{activity.message}</p>
                  <p className="text-xs text-base-content/70 flex items-center">
                    <FiClock className="mr-1" size={12} />
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ProgressChart = ({ datasets }) => {
  const { theme } = useThemeStore();
  
  const colors = {
    completed: theme === 'dark' ? '#22D3EE' : '#0EA5E9',
    pending: theme === 'dark' ? '#3B82F6' : '#2563EB'
  };

  const chartData = datasets.map((dataset) => ({
    name: dataset.name,
    completed: dataset.completed,
    pending: dataset.pending,
  }));

  return (
    <motion.div 
      className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-base-300 dark:border-base-content/10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-base-content flex items-center">
        <FiTrendingUp className="mr-2 text-primary" />
        Annotation Progress
      </h2>
      <motion.div 
        className="h-64 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="name" 
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1F2937' : '#F3F4F6',
                borderColor: theme === 'dark' ? '#374151' : '#D1D5DB',
                borderRadius: '0.5rem',
                color: theme === 'dark' ? '#F9FAFB' : '#111827'
              }}
            />
            <Legend />
            <Bar 
              dataKey="completed" 
              name="Completed" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors.completed} 
                />
              ))}
            </Bar>
            <Bar 
              dataKey="pending" 
              name="Pending" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors.pending} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

const AnnotationTrendChart = ({ annotationTrend }) => {
  const { theme } = useThemeStore();
  
  const chartData = annotationTrend.map((item) => ({
    date: item.date,
    count: item.count,
  }));

  return (
    <motion.div 
      className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-base-300 dark:border-base-content/10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-base-content flex items-center">
        <FiBarChart2 className="mr-2 text-primary" />
        Annotation Trend (Last 7 Days)
      </h2>
      <motion.div 
        className="h-64 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="date" 
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
            >
              <Label 
                value="Number of Annotations" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle', fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
              />
            </YAxis>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1F2937' : '#F3F4F6',
                borderColor: theme === 'dark' ? '#374151' : '#D1D5DB',
                borderRadius: '0.5rem',
                color: theme === 'dark' ? '#F9FAFB' : '#111827'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              name="Annotations" 
              stroke="#22D3EE" 
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

const TopAnnotators = ({ annotators }) => {
  return (
    <motion.div 
      className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-base-300 dark:border-base-content/10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-base-content flex items-center">
        <FiAward className="mr-2 text-primary" />
        Top Annotators
      </h2>
      <div className="space-y-4">
        <AnimatePresence>
          {annotators.length === 0 ? (
            <p className="text-base-content/70">No annotators available.</p>
          ) : (
            annotators.map((annotator, index) => (
              <motion.div 
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {index + 1}
                </motion.div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-base-content">{annotator.name}</p>
                  <div className="w-full bg-base-300 dark:bg-base-200 rounded-full h-2 mt-1 overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${annotator.completion}%` }}
                      transition={{ delay: 0.8 + (index * 0.1), duration: 0.8 }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-sm text-primary font-medium">
                  {annotator.completion}%
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const QuickActionButton = ({ icon: Icon, label, color, delay }) => {
  const colorClasses = {
    primary: 'bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary',
    secondary: 'bg-secondary/10 hover:bg-secondary/20 border-secondary/20 text-secondary',
    accent: 'bg-accent/10 hover:bg-accent/20 border-accent/20 text-accent',
    neutral: 'bg-neutral/10 hover:bg-neutral/20 border-neutral/20 text-neutral'
  };

  return (
    <motion.button
      className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg border transition-all text-sm ${colorClasses[color]}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={20} className="mb-2" />
      <span>{label}</span>
    </motion.button>
  );
};

const Dashboard = () => {
  const { theme } = useThemeStore();

  const { data, error, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: getStatistics,
  });

  if (isLoading) return <Loading />;
  if (error) return <Notification message={error.message} type="error" onClose={() => {}} />;

  const stats = data?.data?.stats || [];
  const activities = data?.data?.activities || [];
  const topAnnotators = data?.data?.topAnnotators || [];
  const datasetsProgress = data?.data?.datasetsProgress || [];
  const annotationTrend = data?.data?.annotationTrend || [];

  const quickActions = [
    { icon: FiPlus, label: 'New Dataset', color: 'primary' },
    { icon: FiUpload, label: 'Import Data', color: 'secondary' },
    { icon: FiUserPlus, label: 'Add Annotator', color: 'accent' },
    { icon: FiBarChart2, label: 'View Reports', color: 'neutral' }
  ];

  return (
    <motion.div
      className="min-h-screen pt-16 pb-16 pl-64 pr-6 space-y-6"
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
          className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Dashboard Overview
        </motion.h1>
        <motion.p
          className="text-base-content/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome back! Here's what's happening with your platform.
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {stats.map((stat, index) => (
          <StatsCard 
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2 space-y-6 flex flex-col"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnnotationTrendChart annotationTrend={annotationTrend} />
          <RecentActivity activities={activities} />
        </motion.div>
        
        <motion.div
          className="space-y-6 flex flex-col"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <TopAnnotators annotators={topAnnotators} />
          <motion.div 
            className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-base-300 dark:border-base-content/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-base-content flex items-center">
              <FiClock className="mr-2 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionButton 
                  key={action.label}
                  icon={action.icon}
                  label={action.label}
                  color={action.color}
                  delay={0.9 + (index * 0.1)}
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