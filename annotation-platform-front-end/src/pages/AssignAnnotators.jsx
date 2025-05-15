import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FiUsers, FiCheckCircle, FiXCircle, FiUser, FiMail, 
  FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiSliders, 
  FiUserPlus, FiArrowLeft, FiChevronLeft, FiChevronRight, FiCalendar
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import Notification from '../components/common/Notification';
import { getAvailableAnnotatorsForDataset, assignAnnotatorsToDataset } from '../api/datasetService';
import useThemeStore from '../store/themeStore';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Redirect if datasetId is undefined
  useEffect(() => {
    if (!datasetId || isNaN(Number(datasetId))) {
      setNotification({ message: 'Invalid dataset ID', type: 'error' });
      navigate('/datasets'); // Redirect to datasets list
    }
  }, [datasetId, navigate]);

  // Query for available annotators data
  const { data, error, isLoading } = useQuery({
    queryKey: ['availableAnnotators', datasetId, currentPage, pageSize, searchTerm, filters],
    queryFn: () => getAvailableAnnotatorsForDataset(datasetId),
    keepPreviousData: true,
    enabled: !!datasetId && !isNaN(Number(datasetId)), // Only run query if datasetId is valid
  });

  // Mutation for assigning annotators
  const assignMutation = useMutation({
    mutationFn: (deadline) => assignAnnotatorsToDataset(datasetId, selectedAnnotators, deadline),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(['availableAnnotators', datasetId]);
        setNotification({ message: response.message, type: 'success' });
        setSelectedAnnotators([]);
        setShowModal(false);
      } else {
        setNotification({ message: response.message, type: 'error' });
      }
    },
    onError: (error) => {
      setNotification({ message: error.message || 'Failed to assign annotators', type: 'error' });
    },
  });

  // Filter and search logic
  const filteredAnnotators = data?.data ? data.data.filter(annotator => {
    const matchesSearch = 
      annotator.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annotator.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annotator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annotator.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filters.status === 'all' || 
      (filters.status === 'active' && annotator.active) || 
      (filters.status === 'inactive' && !annotator.active);
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (filters.sortBy === 'name') {
      const nameA = `${a.prenom} ${a.nom}`.toLowerCase();
      const nameB = `${b.prenom} ${b.nom}`.toLowerCase();
      return filters.sortOrder === 'asc' 
        ? nameA.localeCompare(nameB) 
        : nameB.localeCompare(nameA);
    } else if (filters.sortBy === 'id') {
      return filters.sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
    } else if (filters.sortBy === 'status') {
      return filters.sortOrder === 'asc' 
        ? (a.active === b.active ? 0 : a.active ? -1 : 1)
        : (a.active === b.active ? 0 : a.active ? 1 : -1);
    } else if (filters.sortBy === 'taskCount') {
      return filters.sortOrder === 'asc' 
        ? a.taskCount - b.taskCount 
        : b.taskCount - a.taskCount;
    }
    return 0;
  }) : [];

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
    setSelectedAnnotators(prev => 
      prev.includes(id) 
        ? prev.filter(annotatorId => annotatorId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAnnotators.length === paginatedAnnotators.length) {
      setSelectedAnnotators([]);
    } else {
      setSelectedAnnotators(paginatedAnnotators.map(annotator => annotator.id));
    }
  };

  const handleAssign = () => {
    if (selectedAnnotators.length === 0) {
      setNotification({ message: 'Please select at least one annotator to assign', type: 'warning' });
      return;
    }
    setShowModal(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedDeadline) {
      setNotification({ message: 'Please select a deadline', type: 'warning' });
      return;
    }
    assignMutation.mutate(selectedDeadline);
  };

  const handleCancelAssign = () => {
    setShowModal(false);
    setSelectedDeadline(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <Notification message={error.message} type="error" onClose={() => {}} />;
  if (!datasetId || isNaN(Number(datasetId))) return null; // Avoid rendering if invalid datasetId

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

      {/* Header Section */}
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
            Assign Annotators to Dataset
          </motion.h1>
          <motion.p
            className="text-base-content/70 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Select annotators to assign to Dataset ID {datasetId}
          </motion.p>
        </div>
        <div className="flex gap-3">
          <motion.button
            onClick={() => navigate(`/datasets/${datasetId}`)}
            className="flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{
              scale: 1.03,
              boxShadow: theme === 'dark'
                ? '0 10px 25px -5px rgba(34, 211, 238, 0.3)'
                : '0 10px 25px -5px rgba(6, 182, 212, 0.3)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
            Back to Dataset
          </motion.button>
          <motion.button
            onClick={handleAssign}
            className="flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{
              scale: 1.03,
              boxShadow: theme === 'dark'
                ? '0 10px 25px -5px rgba(34, 211, 238, 0.3)'
                : '0 10px 25px -5px rgba(6, 182, 212, 0.3)',
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.97 }}
            disabled={selectedAnnotators.length === 0 || assignMutation.isLoading}
          >
            <FiUserPlus className="mr-2 group-hover:scale-110 transition-transform" size={18} />
            {assignMutation.isLoading ? 'Assigning...' : `Assign (${selectedAnnotators.length})`}
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <motion.div 
            className="relative flex-1"
            whileHover={{ y: -2 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-base-content/50" />
            </div>
            <input
              type="text"
              placeholder="Search annotators..."
              className="w-full pl-10 pr-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-3 bg-base-200 hover:bg-base-300 rounded-xl transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSliders className="mr-2" />
            Filters
            {showFilters ? (
              <FiChevronUp className="ml-2" />
            ) : (
              <FiChevronDown className="ml-2" />
            )}
          </motion.button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mt-6 pt-6 border-t border-base-300/10 grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  Status
                </label>
                <div className="flex space-x-2">
                  {['all', 'active', 'inactive'].map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => setFilters({ ...filters, status })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.status === status
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-base-200 hover:bg-base-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    className="w-full pl-4 pr-10 py-2.5 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  >
                    <option value="name">Name</option>
                    <option value="id">ID</option>
                    <option value="status">Status</option>
                    <option value="taskCount">Task Count</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="text-base-content/50" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  Order
                </label>
                <div className="flex space-x-2">
                  {['asc', 'desc'].map((order) => (
                    <motion.button
                      key={order}
                      onClick={() => setFilters({ ...filters, sortOrder: order })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.sortOrder === order
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-base-200 hover:bg-base-300'
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

      {/* Annotators Table */}
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
            <FiUsers className="mr-2 text-primary" size={20} />
            Available Annotators
          </motion.h2>
          <motion.p 
            className="text-sm text-base-content/70 drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Showing {startIndex}-{endIndex} of {totalAnnotators} annotators
          </motion.p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:bg-base-200/70 text-base-content/80 dark:text-base-content/90 text-sm shadow-sm rounded-t-xl">
                <th className="p-4 text-left w-12">
                  <motion.input
                    type="checkbox"
                    className="w-5 h-5 rounded border-base-300 text-primary focus:ring-primary/50"
                    checked={paginatedAnnotators.length > 0 && selectedAnnotators.length === paginatedAnnotators.length}
                    onChange={handleSelectAll}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </th>
                <th className="p-4 text-left font-medium w-20"><FiUser size={16} className="inline mr-2" />ID</th>
                <th className="p-4 text-left font-medium"><FiUser size={16} className="inline mr-2" />First Name</th>
                <th className="p-4 text-left font-medium"><FiUser size={16} className="inline mr-2" />Last Name</th>
                <th className="p-4 text-left font-medium"><FiMail size={16} className="inline mr-2" />Email</th>
                <th className="p-4 text-left font-medium"><FiCheckCircle size={16} className="inline mr-2" />Status</th>
                <th className="p-4 text-left font-medium"><FiUsers size={16} className="inline mr-2" />Task Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/10">
              <AnimatePresence>
                {paginatedAnnotators.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="7" className="p-8 text-center text-base-content/50">
                      No annotators available for this dataset.
                    </td>
                  </motion.tr>
                ) : (
                  paginatedAnnotators.map((annotator, index) => (
                    <motion.tr
                      key={annotator.id}
                      className={`transition-colors duration-300 ${
                        index % 2 === 0 
                          ? 'bg-base-100/50 dark:bg-base-200/20' 
                          : 'bg-base-100/70 dark:bg-base-200/30'
                      } ${selectedAnnotators.includes(annotator.id) ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.7 + index * 0.05 }
                      }}
                      exit={{ opacity: 0 }}
                      whileHover={ { 
                        backgroundImage: 'linear-gradient(to right, rgba(34, 211, 238, 0.05), rgba(217, 70, 239, 0.05))',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        rotateX: 2,
                        rotateY: 2,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <td className="p-4">
                        <motion.input
                          type="checkbox"
                          className="w-5 h-5 rounded border-base-300 text-primary focus:ring-primary/50"
                          checked={selectedAnnotators.includes(annotator.id)}
                          onChange={() => handleSelectAnnotator(annotator.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      </td>
                      <td className="p-4 font-mono text-primary/90 dark:text-primary">
                        {annotator.id}
                      </td>
                      <td className="p-4 font-medium text-base-content/90 dark:text-base-content">
                        {annotator.prenom}
                      </td>
                      <td className="p-4 font-medium text-base-content/90 dark:text-base-content">
                        {annotator.nom}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <FiMail className="mr-2 text-base-content/50 dark:text-base-content/70" size={14} />
                          <span className="text-sm text-base-content/90 dark:text-base-content">{annotator.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <motion.div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            annotator.active 
                              ? 'bg-success/10 text-success dark:bg-success/20 dark:text-success' 
                              : 'bg-error/10 text-error dark:bg-error/20 dark:text-error'
                          }`}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: annotator.active 
                              ? '0 0 10px rgba(16, 185, 129, 0.3)' 
                              : '0 0 10px rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          {annotator.active ? (
                            <>
                              <FiCheckCircle className="mr-1" size={14} />
                              Active
                            </>
                          ) : (
                            <>
                              <FiXCircle className="mr-1" size={14} />
                              Inactive
                            </>
                          )}
                        </motion.div>
                      </td>
                      <td className="p-4 text-base-content/90 dark:text-base-content">
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
            className="p-6 flex justify-between items-center bg-gradient-to-r from-primary/5 to-secondary/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                currentPage === 0
                  ? 'bg-base-300 dark:bg-base-200 text-base-content/50 cursor-not-allowed'
                  : 'bg-primary/20 text-primary hover:bg-primary/30'
              }`}
              whileHover={{ scale: currentPage === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 0 ? 1 : 0.95 }}
            >
              <FiChevronLeft className="mr-2" size={16} />
              Previous
            </motion.button>
            <motion.div
              className="text-sm text-base-content/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              Page {currentPage + 1} of {totalPages}
            </motion.div>
            <motion.button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                currentPage >= totalPages - 1
                  ? 'bg-base-300 dark:bg-base-200 text-base-content/50 cursor-not-allowed'
                  : 'bg-primary/20 text-primary hover:bg-primary/30'
              }`}
              whileHover={{ scale: currentPage >= totalPages - 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage >= totalPages - 1 ? 1 : 0.95 }}
            >
              Next
              <FiChevronRight className="ml-2" size={16} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Assign Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-base-200/70 dark:bg-base-100/70 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-primary/20 w-full max-w-md"
              initial={{ scale: 0.7, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 50 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.h2
                className="text-xl font-semibold flex items-center text-base-content mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <FiCalendar className="mr-2 text-primary" size={20} />
                Set Assignment Deadline
              </motion.h2>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-2">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    value={selectedDeadline ? new Date(selectedDeadline).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setSelectedDeadline(e.target.value)}
                    min="2025-05-13T19:17:00+01:00" // Current time: 07:17 PM +01, May 13, 2025
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <motion.button
                    onClick={handleCancelAssign}
                    className="px-4 py-2 rounded-xl bg-base-300 hover:bg-base-400 text-base-content transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleConfirmAssign}
                    className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: theme === 'dark'
                        ? '0 10px 25px -5px rgba(34, 211, 238, 0.3)'
                        : '0 10px 25px -5px rgba(6, 182, 212, 0.3)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    disabled={assignMutation.isLoading}
                  >
                    {assignMutation.isLoading ? 'Assigning...' : 'Assign'}
                    <FiUserPlus className="ml-2" size={18} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssignAnnotators;