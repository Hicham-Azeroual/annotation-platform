import { motion } from 'framer-motion'
import { FiDatabase, FiUsers, FiCheckCircle, FiTrendingUp } from 'react-icons/fi'

const iconMap = {
  'database': <FiDatabase size={24} />,
  'users': <FiUsers size={24} />,
  'check-circle': <FiCheckCircle size={24} />,
  'trending-up': <FiTrendingUp size={24} />
}

const StatsCard = ({ title, value, change, icon, delay = 0 }) => {
  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </p>
        </div>
        <div className="p-3 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-500/30">
          {iconMap[icon]}
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard