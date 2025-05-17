import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { FiBarChart2 } from "react-icons/fi";
import useThemeStore from "../../store/themeStore";

const AnnotationTrendChart = ({ annotationTrend }) => {
  const { theme } = useThemeStore();

  const chartData = annotationTrend.map((item) => ({
    date: item.date,
    count: item.count,
  }));

  return (
    <motion.div
      className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-base-content flex items-center">
        <FiBarChart2 className="mr-2 text-primary" />
        Annotation Trend (Last 7 Days)
      </h2>
      <motion.div
        className="h-48 sm:h-56 md:h-64 mt-3 sm:mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
            />
            <XAxis
              dataKey="date"
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              tick={{ fontSize: 10 }}
            >
              <Label
                value="Number of Annotations"
                angle={-90}
                position="insideLeft"
                style={{
                  textAnchor: "middle",
                  fill: theme === "dark" ? "#9CA3AF" : "#6B7280",
                  fontSize: 10,
                }}
              />
            </YAxis>
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1F2937" : "#F3F4F6",
                borderColor: theme === "dark" ? "#374151" : "#D1D5DB",
                borderRadius: "0.5rem",
                color: theme === "dark" ? "#F9FAFB" : "#111827",
                fontSize: "0.875rem",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "0.75rem",
                paddingTop: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              name="Annotations"
              stroke="#22D3EE"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default AnnotationTrendChart;
