import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';
import useThemeStore from '../../store/themeStore';

const ProgressChart = ({ datasets }) => {
  const { theme } = useThemeStore();
  
  const colors = {
    completed: theme === 'dark' ? '#22D3EE' : '#0EA5E9',
    pending: theme === 'dark' ? '#3B82F6' : '#2563EB',
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
                color: theme === 'dark' ? '#F9FAFB' : '#111827',
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

export default ProgressChart;