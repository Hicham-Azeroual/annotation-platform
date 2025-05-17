import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiMail,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiSliders,
  FiUserPlus,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiX,
} from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/common/Loading";
import Notification from "../components/common/Notification";
import {
  getAvailableAnnotatorsForDataset,
  assignAnnotatorsToDataset,
} from "../api/datasetService";
import useThemeStore from "../store/themeStore";

const AssignAnnotators = () => {
  const { datasetId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useThemeStore();
  const [notification, setNotification] = useState(null);
  const [selectedAnnotators, setSelectedAnnotators] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Redirect if datasetId is undefined
  useEffect(() => {
    if (!datasetId || isNaN(Number(datasetId))) {
      setNotification({ message: "Invalid dataset ID", type: "error" });
      navigate("/datasets"); // Redirect to datasets list
    }
  }, [datasetId, navigate]);

  // Query for available annotators data
  const { data, error, isLoading } = useQuery({
    queryKey: [
      "availableAnnotators",
      datasetId,
      currentPage,
      pageSize,
      searchTerm,
      filters,
    ],
    queryFn: () => getAvailableAnnotatorsForDataset(datasetId),
    keepPreviousData: true,
    enabled: !!datasetId && !isNaN(Number(datasetId)), // Only run query if datasetId is valid
  });

  // Mutation for assigning annotators
  const assignMutation = useMutation({
    mutationFn: (deadline) =>
      assignAnnotatorsToDataset(datasetId, selectedAnnotators, deadline),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(["availableAnnotators", datasetId]);
        setNotification({ message: response.message, type: "success" });
        setSelectedAnnotators([]);
        setShowModal(false);
      } else {
        setNotification({ message: response.message, type: "error" });
      }
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to assign annotators",
        type: "error",
      });
    },
  });

  // Filter and search logic
  const filteredAnnotators = data?.data
    ? data.data
        .filter((annotator) => {
          const matchesSearch =
            annotator.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            annotator.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            annotator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            annotator.username.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus =
            filters.status === "all" ||
            (filters.status === "active" && annotator.active) ||
            (filters.status === "inactive" && !annotator.active);

          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          if (filters.sortBy === "name") {
            const nameA = `${a.prenom} ${a.nom}`.toLowerCase();
            const nameB = `${b.prenom} ${b.nom}`.toLowerCase();
            return filters.sortOrder === "asc"
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          } else if (filters.sortBy === "id") {
            return filters.sortOrder === "asc" ? a.id - b.id : b.id - a.id;
          } else if (filters.sortBy === "status") {
            return filters.sortOrder === "asc"
              ? a.active === b.active
                ? 0
                : a.active
                ? -1
                : 1
              : a.active === b.active
              ? 0
              : a.active
              ? 1
              : -1;
          } else if (filters.sortBy === "taskCount") {
            return filters.sortOrder === "asc"
              ? a.taskCount - b.taskCount
              : b.taskCount - a.taskCount;
          }
          return 0;
        })
    : [];

  // Pagination logic
  const totalAnnotators = filteredAnnotators.length;
  const totalPages = Math.ceil(totalAnnotators / pageSize);
  const paginatedAnnotators = filteredAnnotators.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalAnnotators);

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handleSelectAnnotator = (id) => {
    setSelectedAnnotators((prev) =>
      prev.includes(id)
        ? prev.filter((annotatorId) => annotatorId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (
      selectedAnnotators.length === paginatedAnnotators.length &&
      paginatedAnnotators.length > 0
    ) {
      setSelectedAnnotators([]);
    } else {
      setSelectedAnnotators(
        paginatedAnnotators.map((annotator) => annotator.id)
      );
    }
  };

  const handleAssign = () => {
    if (selectedAnnotators.length === 0) {
      setNotification({
        message: "Please select at least one annotator to assign",
        type: "warning",
      });
      return;
    }
    setShowModal(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedDeadline) {
      setNotification({ message: "Please select a deadline", type: "warning" });
      return;
    }
    assignMutation.mutate(selectedDeadline);
  };

  const handleCancelAssign = () => {
    setShowModal(false);
    setSelectedDeadline(null);
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <Notification message={error.message} type="error" onClose={() => {}} />
    );
  if (!datasetId || isNaN(Number(datasetId))) return null; // Avoid rendering if invalid datasetId

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 md:space-y-10 bg-gradient-to-br from-base-200/60 to-base-100/60 dark:from-base-100/60 dark:to-base-200/60"
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

      {/* Header Section */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Assign Annotators
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base text-base-content/70 mt-1 sm:mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Select annotators to assign to Dataset ID {datasetId}
          </motion.p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            onClick={() => navigate(`/datasets/${datasetId}`)}
            className="flex items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 text-base-content font-medium transition-all shadow-md hover:shadow-lg group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform w-4 h-4 sm:w-5 sm:h-5" />
            Back to Dataset
          </motion.button>
          <motion.button
            onClick={handleAssign}
            className="flex items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{
              scale: 1.02,
              boxShadow:
                theme === "dark"
                  ? "0 8px 20px -4px rgba(34, 211, 238, 0.3)"
                  : "0 8px 20px -4px rgba(6, 182, 212, 0.3)",
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.98 }}
            disabled={
              selectedAnnotators.length === 0 || assignMutation.isLoading
            }
          >
            <FiUserPlus className="mr-2 group-hover:scale-110 transition-transform w-4 h-4 sm:w-5 sm:h-5" />
            {assignMutation.isLoading
              ? "Assigning..."
              : `Assign (${selectedAnnotators.length})`}
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <motion.div
            className="relative flex-grow w-full md:w-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ x: -5 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-base-content/50 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              placeholder="Search annotators..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm sm:text-base text-base-content dark:bg-base-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          <motion.div
            className="relative w-full md:w-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 sm:py-2.5 w-full bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 rounded-xl text-base-content font-medium transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
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

            {/* Filter Dropdown */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="absolute z-50 mt-2 w-full md:w-64 bg-base-100 rounded-xl shadow-xl overflow-hidden border border-base-300 dark:border-base-content/10 right-0 md:left-auto"
                  initial={{ opacity: 0, y: 10, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: 10, scaleY: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: "top" }}
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-base-content/80 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full px-3 py-2 rounded-lg bg-base-200 text-base-content text-sm focus:outline-none focus:ring-primary/50 focus:border-transparent transition-colors"
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                      >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-base-content/80 mb-1">
                        Sort By
                      </label>
                      <select
                        className="w-full px-3 py-2 rounded-lg bg-base-200 text-base-content text-sm focus:outline-none focus:ring-primary/50 focus:border-transparent transition-colors"
                        value={filters.sortBy}
                        onChange={(e) =>
                          setFilters({ ...filters, sortBy: e.target.value })
                        }
                      >
                        <option value="name">Name</option>
                        <option value="id">ID</option>
                        <option value="status">Status</option>
                        <option value="taskCount">Task Count</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-base-content/80 mb-1">
                        Sort Order
                      </label>
                      <select
                        className="w-full px-3 py-2 rounded-lg bg-base-200 text-base-content text-sm focus:outline-none focus:ring-primary/50 focus:border-transparent transition-colors"
                        value={filters.sortOrder}
                        onChange={(e) =>
                          setFilters({ ...filters, sortOrder: e.target.value })
                        }
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Annotators Table */}
      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-base-300/10 text-base-content/70 text-xs sm:text-sm">
                <th className="py-3 sm:py-4 px-4 sm:px-6">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={
                      selectedAnnotators.length ===
                        paginatedAnnotators.length &&
                      paginatedAnnotators.length > 0
                    }
                    onChange={handleSelectAll}
                    disabled={paginatedAnnotators.length === 0}
                  />
                </th>
                <th className="py-3 sm:py-4 px-4 sm:px-6">ID</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6">Picture</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6">Name</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6">Username</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6">Email</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6">Status</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6">Task Count</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedAnnotators.length === 0 ? (
                  <motion.tr
                    className="col-span-full text-center text-base-content/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="8" className="py-8 px-6">
                      No annotators found.
                    </td>
                  </motion.tr>
                ) : (
                  paginatedAnnotators.map((annotator) => (
                    <motion.tr
                      key={annotator.id}
                      className="border-b border-base-300/10 hover:bg-base-200/80 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 80 }}
                    >
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm"
                          checked={selectedAnnotators.includes(annotator.id)}
                          onChange={() => handleSelectAnnotator(annotator.id)}
                        />
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-base-content text-xs sm:text-sm">
                        {annotator.id}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <FiUser size={18} />
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-base-content text-xs sm:text-sm">{`${annotator.prenom} ${annotator.nom}`}</td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-base-content text-xs sm:text-sm">
                        {annotator.username}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-base-content text-xs sm:text-sm">
                        {annotator.email}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm">
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            annotator.active
                              ? "bg-success/20 text-success"
                              : "bg-error/20 text-error"
                          }`}
                        >
                          {annotator.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-base-content text-xs sm:text-sm">
                        {annotator.taskCount}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalAnnotators > 0 && (
          <motion.div
            className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-primary/5 to-secondary/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="text-sm text-base-content/70 drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              Showing {startIndex}-{endIndex} of {totalAnnotators} annotators
            </motion.div>
            <div className="flex gap-2">
              <motion.button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="flex items-center px-3 sm:px-4 py-2 bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 rounded-xl text-base-content font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                whileHover={{ scale: currentPage === 0 ? 1 : 1.02 }}
                whileTap={{ scale: currentPage === 0 ? 1 : 0.98 }}
              >
                <FiChevronLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Previous
              </motion.button>

              <motion.button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center px-3 sm:px-4 py-2 bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 rounded-xl text-base-content font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                whileHover={{ scale: currentPage >= totalPages - 1 ? 1 : 1.02 }}
                whileTap={{ scale: currentPage >= totalPages - 1 ? 1 : 0.98 }}
              >
                Next
                <FiChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelAssign} // Close modal when clicking outside
          >
            <motion.div
              className="bg-base-100 rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full relative"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
              <motion.button
                onClick={handleCancelAssign}
                className="absolute top-4 right-4 text-base-content/50 hover:text-base-content transition-colors"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-6 h-6" />
              </motion.button>
              <h3 className="text-xl font-bold mb-4 text-base-content">
                Set Assignment Deadline
              </h3>
              <div className="mb-6">
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-base-content/80 mb-2"
                >
                  Select a Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  className="w-full px-3 py-2 rounded-lg bg-base-200 text-base-content focus:outline-none focus:ring-primary/50 focus:border-transparent transition-colors"
                  onChange={(e) => setSelectedDeadline(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelAssign}
                  className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-400 text-base-content transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAssign}
                  disabled={!selectedDeadline || assignMutation.isLoading}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-content hover:bg-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assignMutation.isLoading
                    ? "Assigning..."
                    : "Confirm Assignment"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssignAnnotators;
