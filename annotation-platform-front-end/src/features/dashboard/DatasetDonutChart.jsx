import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { FiDatabase } from "react-icons/fi";

// Color palette matching Tailwind's primary, secondary, and neutral
const COLORS = ["#34d399", "#fbbf24", "#a3a3a3"]; // primary (green), secondary (yellow), gray
const LABELS = ["Completed", "In Progress", "Unassigned"];

// Helper to get counts for each status
const getStatusCounts = (data) => {
  let completed = 0,
    inProgress = 0,
    unassigned = 0;
  data.forEach((ds) => {
    completed += ds.completed;
    inProgress += ds.pending;
    if (ds.completed === 0 && ds.pending === 0) unassigned += 1;
  });
  return [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "Unassigned", value: unassigned },
  ];
};

// Custom label for pie slices
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent > 0.05) {
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight={600}
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}
      >
        {LABELS[index]}
      </text>
    );
  }
  return null;
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-base-100/90 dark:bg-base-200/90 backdrop-blur-md rounded-lg p-3 shadow-lg border border-base-300/20">
        <p className="text-sm font-medium text-base-content">{`${name}: ${value}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Legend component
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-base-content/80">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const DatasetDonutChart = ({ data }) => {
  const chartData = getStatusCounts(data);

  // Animation variants for pie slices
  const pieVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.8 + i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-base-300/20 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { backgroundColor: { duration: 0 } },
      }}
      transition={{ delay: 0.4, duration: 0.6 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="p-2 rounded-lg bg-primary/10"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 360] }}
          transition={{ delay: 0.6, duration: 0.8 }}
          whileHover={{
            scale: 1.2,
            boxShadow: "0 0 15px rgba(52, 211, 153, 0.5)",
          }}
        >
          <FiDatabase className="w-6 h-6 text-primary" />
        </motion.div>
        <motion.h3
          className="text-xl font-semibold text-base-content"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Dataset Distribution
        </motion.h3>
      </div>
      <div className="w-full flex flex-col items-center">
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={130}
              paddingAngle={3}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
              isAnimationActive={true}
              animationDuration={1000}
            >
              {chartData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={COLORS[idx % COLORS.length]}
                  as={motion.path}
                  variants={pieVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  custom={idx}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DatasetDonutChart;
