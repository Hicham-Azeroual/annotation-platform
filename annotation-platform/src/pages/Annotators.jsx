import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FiUsers, FiPlus, FiEdit, FiTrash2, FiCheckCircle, 
  FiXCircle, FiUser, FiMail, FiKey, FiActivity, 
  FiHash, FiSearch, FiFilter, FiChevronDown, 
  FiChevronUp, FiSliders 
} from 'react-icons/fi';
import { Tilt } from 'react-tilt';
import { 
  getAllAnnotators, getAnnotatorById, 
  createAnnotator, updateAnnotator, deleteAnnotator 
} from '../api/annotatorService';
import Loading from '../components/common/Loading';
import Notification from '../components/common/Notification';

const StatsCard = ({ title, value, icon, color }) => {
  const colorVariants = {
    primary: 'from-primary to-secondary',
    success: 'from-emerald-500 to-teal-500',
    error: 'from-rose-500 to-pink-500',
    warning: 'from-amber-500 to-orange-500',
    info: 'from-sky-500 to-blue-500'
  };

  const IconComponent = {
    users: FiUsers,
    active: FiCheckCircle,
    inactive: FiXCircle
  }[icon] || FiUsers;

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
    <Tilt options={{ max: 15, scale: 1.05, perspective: 1000, glare: true, "max-glare": 0.2 }}>
      <motion.div
        className="relative bg-base-100 rounded-xl p-6 shadow-lg overflow-hidden group"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        whileHover={{ y: -5 }}
      >
        <motion.div
          className="absolute left-0 top-0 w-1 h-full"
          animate={{
            backgroundColor: gradientColors,
          }}
          transition={{
            backgroundColor: {
              duration: 12,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
            }
          }}
        />

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
            backgroundImage: {
              duration: 12,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
            },
            opacity: {
              duration: 12,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
            },
            rotate: {
              duration: 12,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
            }
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
              className="text-3xl font-bold"
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
            <IconComponent size={24} className={`text-${color}-500`} />
          </motion.div>
        </div>
      </motion.div>
    </Tilt>
  );
};

const AnnotatorModal = ({ isOpen, onClose, annotator, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    username: '',
    email: '',
    active: true,
    regeneratePassword: false
  });

  useEffect(() => {
    if (annotator) {
      setFormData({
        nom: annotator.nom || '',
        prenom: annotator.prenom || '',
        username: annotator.username || '',
        email: annotator.email || '',
        active: annotator.active ?? true,
        regeneratePassword: false
      });
    }
  }, [annotator]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <motion.div
            className="bg-base-100 rounded-2xl p-8 shadow-2xl border border-primary/20 max-w-lg w-full relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <motion.div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <motion.h2 
                  className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {isEdit ? 'Edit Annotator' : 'Add Annotator'}
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-base-200 transition-colors"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiXCircle size={20} className="text-base-content/70" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-base-content/70 mb-1">First Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-sm font-medium text-base-content/70 mb-1">Last Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-base-content/70 mb-1">Username</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="block text-sm font-medium text-base-content/70 mb-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-3 pt-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-base-300 text-primary focus:ring-primary/50"
                    />
                    <label className="ml-2 text-sm text-base-content/80">Active</label>
                  </div>

                  {isEdit && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="regeneratePassword"
                        checked={formData.regeneratePassword}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-base-300 text-primary focus:ring-primary/50"
                      />
                      <label className="ml-2 text-sm text-base-content/80 flex items-center">
                        <FiKey className="mr-1" size={14} /> Regenerate Password
                      </label>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  className="flex justify-end space-x-3 pt-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-base-200 text-base-content hover:bg-base-300 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.3)'
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isEdit ? 'Update' : 'Create'}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-base-100 rounded-2xl p-8 shadow-2xl border border-error/20 max-w-md w-full relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <motion.div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-error/10 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            
            <div className="relative z-10">
              <div className="text-center">
                <motion.div
                  className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-error/10 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <FiXCircle size={32} className="text-error" />
                </motion.div>
                
                <motion.h3
                  className="text-xl font-bold text-base-content mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Confirm Deactivation
                </motion.h3>
                
                <motion.p
                  className="text-base-content/70 mb-6"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Are you sure you want to deactivate this annotator? This action cannot be undone.
                </motion.p>
                
                <motion.div
                  className="flex justify-center space-x-3"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-base-200 text-base-content hover:bg-base-300 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={onConfirm}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-error to-error-dark text-white shadow-lg hover:shadow-error/30 transition-all"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3)'
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Deactivate
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Annotators = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnnotator, setSelectedAnnotator] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Query for annotators data
  const { data, error, isLoading } = useQuery({
    queryKey: ['annotators'],
    queryFn: getAllAnnotators,
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
    }
    return 0;
  }) : [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: createAnnotator,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(['annotators']);
        setNotification({ message: response.message, type: 'success' });
        setIsAddModalOpen(false);
      } else {
        setNotification({ message: response.message, type: 'error' });
      }
    },
    onError: () => {
      setNotification({ message: 'Failed to create annotator', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, annotator }) => updateAnnotator(id, annotator),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(['annotators']);
        setNotification({ message: response.message, type: 'success' });
        setIsEditModalOpen(false);
      } else {
        setNotification({ message: response.message, type: 'error' });
      }
    },
    onError: () => {
      setNotification({ message: 'Failed to update annotator', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnotator,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(['annotators']);
        setNotification({ message: response.message, type: 'success' });
        setIsDeleteModalOpen(false);
      } else {
        setNotification({ message: response.message, type: 'error' });
      }
    },
    onError: () => {
      setNotification({ message: 'Failed to deactivate annotator', type: 'error' });
    },
  });

  // Handlers
  const handleAddSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  const handleEdit = async (id) => {
    const response = await getAnnotatorById(id);
    if (response.success) {
      setSelectedAnnotator(response.data);
      setIsEditModalOpen(true);
    } else {
      setNotification({ message: response.message, type: 'error' });
    }
  };

  const handleDelete = (annotator) => {
    setSelectedAnnotator(annotator);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateSubmit = (formData) => {
    updateMutation.mutate({ id: selectedAnnotator.id, annotator: formData });
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(selectedAnnotator.id);
  };

  if (isLoading) return <Loading />;
  if (error) return <Notification message={error.message} type="error" onClose={() => {}} />;

  const annotators = data?.data || [];
  const totalAnnotators = annotators.length;
  const activeAnnotators = annotators.filter(a => a.active).length;
  const inactiveAnnotators = totalAnnotators - activeAnnotators;

  return (
    <motion.div
      className="min-h-screen pt-16 pb-16 pl-64 pr-6 space-y-8" // Adjusted padding for fixed navbar (64px top), footer (64px bottom), and sidebar (64px left)
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
            Annotators Management
          </motion.h1>
          <motion.p
            className="text-base-content/70 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Manage and organize your team of annotators
          </motion.p>
        </div>
        
        <motion.button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ 
            scale: 1.03,
            boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.3)'
          }}
          whileTap={{ scale: 0.97 }}
        >
          <FiPlus className="mr-2 group-hover:rotate-90 transition-transform" size={18} />
          Add Annotator
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <StatsCard
          title="Total Annotators"
          value={totalAnnotators}
          icon="users"
          color="primary"
        />
        <StatsCard
          title="Active Annotators"
          value={activeAnnotators}
          icon="active"
          color="success"
        />
        <StatsCard
          title="Inactive Annotators"
          value={inactiveAnnotators}
          icon="inactive"
          color="error"
        />
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        className="bg-base-100/90 dark:bg-base-200/30 backdrop-blur-sm rounded-2xl shadow-xl border border-base-300/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
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

          {/* Filter Toggle Button */}
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

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mt-6 pt-6 border-t border-base-300/10 grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Status Filter */}
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

              {/* Sort By */}
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
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="text-base-content/50" />
                  </div>
                </div>
              </div>

              {/* Sort Order */}
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
        className="bg-base-100/90 dark:bg-base-200/30 backdrop-blur-sm rounded-2xl shadow-xl border border-base-300/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-6 border-b border-base-300/10 flex justify-between items-center">
          <motion.h2 
            className="text-xl font-semibold flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <FiUsers className="mr-2 text-primary" size={20} />
            Annotators List
          </motion.h2>
          <motion.p 
            className="text-sm text-base-content/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Showing {filteredAnnotators.length} of {totalAnnotators} annotators
          </motion.p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:bg-base-200/70 text-base-content/80 dark:text-base-content/90 text-sm shadow-sm rounded-t-xl">
                <th className="p-4 text-left font-medium w-20"><FiHash size={16} className="inline mr-2" />ID</th>
                <th className="p-4 text-left font-medium"><FiUser size={16} className="inline mr-2" />First Name</th>
                <th className="p-4 text-left font-medium"><FiUser size={16} className="inline mr-2" />Last Name</th>
                <th className="p-4 text-left font-medium"><FiMail size={16} className="inline mr-2" />Email</th>
                <th className="p-4 text-left font-medium"><FiActivity size={16} className="inline mr-2" />Status</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/10">
              <AnimatePresence>
                {filteredAnnotators.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="6" className="p-8 text-center text-base-content/50">
                      No annotators found matching your criteria.
                    </td>
                  </motion.tr>
                ) : (
                  filteredAnnotators.map((annotator, index) => (
                    <motion.tr
                      key={annotator.id}
                      className={`transition-colors duration-300 ${
                        index % 2 === 0 
                          ? 'bg-base-100/50 dark:bg-base-200/20' 
                          : 'bg-base-100/70 dark:bg-base-200/30'
                      }`}
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
                      <td className="p-4">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            onClick={() => handleEdit(annotator.id)}
                            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                            whileHover={{ 
                              scale: 1.1,
                              boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEdit size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(annotator)}
                            className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 dark:bg-error/20 dark:hover:bg-error/30 transition-colors"
                            whileHover={{ 
                              scale: 1.1,
                              boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
                            }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiTrash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modals */}
      <AnnotatorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
      <AnnotatorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        annotator={selectedAnnotator}
        onSubmit={handleUpdateSubmit}
        isEdit
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </motion.div>
  );
};

export default Annotators;