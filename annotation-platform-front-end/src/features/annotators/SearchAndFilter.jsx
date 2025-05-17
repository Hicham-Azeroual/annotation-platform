import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiSliders,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Search Input */}
        <motion.div className="relative flex-1 w-full" whileHover={{ y: -2 }}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-base-content/50 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            type="text"
            placeholder="Search annotators..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-base-300 dark:bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm sm:text-base text-base-content"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Filter Toggle Button */}
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 rounded-xl transition-colors text-sm sm:text-base text-base-content"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiSliders className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
          Filters
          {showFilters ? (
            <FiChevronUp className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <FiChevronDown className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </motion.button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-base-300/10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-base-content/70 mb-2 sm:mb-3">
                Status
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {["all", "active", "inactive"].map((status) => (
                  <motion.button
                    key={status}
                    onClick={() => setFilters({ ...filters, status })}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                      filters.status === status
                        ? "bg-primary text-white shadow-md"
                        : "bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 text-base-content"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-base-content/70 mb-2 sm:mb-3">
                Sort By
              </label>
              <div className="relative">
                <select
                  className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-base-300 dark:bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none transition-all text-sm sm:text-base text-base-content"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                >
                  <option value="name">Name</option>
                  <option value="id">ID</option>
                  <option value="status">Status</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiChevronDown className="text-base-content/50 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>

            {/* Sort Order */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-base-content/70 mb-2 sm:mb-3">
                Order
              </label>
              <div className="flex gap-2 sm:gap-3">
                {["asc", "desc"].map((order) => (
                  <motion.button
                    key={order}
                    onClick={() => setFilters({ ...filters, sortOrder: order })}
                    className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                      filters.sortOrder === order
                        ? "bg-primary text-white shadow-md"
                        : "bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 text-base-content"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {order === "asc" ? "Ascending" : "Descending"}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchAndFilter;
