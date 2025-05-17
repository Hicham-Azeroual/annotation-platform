import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiDatabase } from "react-icons/fi";

const DatasetsProgressChart = ({ data }) => {
  // Transform data for the chart
  const chartData = data.map((dataset) => ({
    name: dataset.name,
    completed: dataset.completed,
    pending: dataset.pending,
    total: dataset.completed + dataset.pending,
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 dark:bg-base-200 p-4 rounded-lg shadow-lg border border-base-300/20">
          <p className="font-semibold text-base-content">{label}</p>
          <p className="text-success">Completed: {payload[0].value}</p>
          <p className="text-warning">Pending: {payload[1].value}</p>
          <p className="text-primary">Total: {payload[2].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-base-100 dark:bg-base-200 rounded-xl p-6 shadow-lg border border-base-300/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <FiDatabase className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-base-content">
          Datasets Progress
        </h3>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              opacity={0.1}
            />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
            />
            <YAxis
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="rgb(34, 197, 94)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pending"
              name="Pending"
              fill="rgb(234, 179, 8)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="total"
              name="Total"
              fill="rgb(6, 182, 212)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DatasetsProgressChart;
