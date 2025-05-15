import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiDatabase, FiArrowLeft, FiChevronLeft, FiChevronRight,
  FiCheckCircle, FiActivity, FiXCircle, FiType, FiUserMinus,
  FiSearch,
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import Notification from '../components/common/Notification';
import { getDatasetDetails, getCoupeTextesByDatasetId, unassignAnnotatorFromDataset } from '../api/datasetService';
import useThemeStore from '../store/themeStore';

const StatsCard = ({ title, value, icon: Icon, color, delay = 0 }) => {
  const { theme } = useThemeStore();

  const gradientColors = [
    '#22D3EE', // Cyan
    '#D946EF', // Magenta
    '#3B82F6', // Electric Blue
    '#4ADE80', // Neon Green
    '#F472B6', // Hot Pink
    '#8B5CF6', // Violet
    '#22D3EE', // Loop back to Cyan
  ];

  return (
    <motion.div
      className="relative bg-base-200/70 dark:bg-base-100/70 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-primary/20 transition-all overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      initial={{ y: 50, opacity: 0, rotateX: 10 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.8, delay, type: 'spring', stiffness: 80 }}
      whileHover={{
        y: -10,
        rotateX: 5,
        rotateY: 5,
        boxShadow: theme === 'dark'
          ? '0 15px 40px rgba(34, 211, 238, 0.3)'
          : '0 15px 40px rgba(6, 182, 212, 0.3)',
      }}
    >
      <motion.div
        className="absolute inset-0 border-2 border-transparent rounded-xl"
        style={{
          borderImage: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]}) 1`,
        }}
        animate={{
          borderImage: [
            `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]}) 1`,
            `linear-gradient(45deg, ${gradientColors[1]}, ${gradientColors[2]}) 1`,
            `linear-gradient(45deg, ${gradientColors[2]}, ${gradientColors[3]}) 1`,
            `linear-gradient(45deg, ${gradientColors[3]}, ${gradientColors[4]}) 1`,
            `linear-gradient(45deg, ${gradientColors[4]}, ${gradientColors[5]}) 1`,
            `linear-gradient(45deg, ${gradientColors[5]}, ${gradientColors[6]}) 1`,
          ],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundImage: [
            `radial-gradient(circle at 20% 20%, ${gradientColors[0]}20, transparent 70%)`,
            `radial-gradient(circle at 80% 20%, ${gradientColors[1]}20, transparent 70%)`,
            `radial-gradient(circle at 20% 80%, ${gradientColors[2]}20, transparent 70%)`,
            `radial-gradient(circle at 80% 80%, ${gradientColors[3]}20, transparent 70%)`,
            `radial-gradient(circle at 50% 50%, ${gradientColors[4]}20, transparent 70%)`,
            `radial-gradient(circle at 20% 20%, ${gradientColors[5]}20, transparent 70%)`,
          ],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1">
          <p className="text-base-content/80 text-sm font-semibold uppercase tracking-wide">{title}</p>
          <motion.div
            className="text-4xl font-extrabold mt-2 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, backgroundPosition: '0%' }}
            animate={{
              opacity: 1,
              backgroundPosition: ['0%', '100%'],
            }}
            transition={{
              opacity: { delay: delay + 0.2 },
              backgroundPosition: {
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            {value}
          </motion.div>
        </div>
        <motion.div
          className="relative p-4 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.1, type: 'spring', stiffness: 120 }}
          whileHover={{ rotate: 15, scale: 1.1 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 20px ${gradientColors[0]}80`,
            }}
            animate={{
              boxShadow: [
                `0 0 20px ${gradientColors[0]}80`,
                `0 0 20px ${gradientColors[1]}80`,
                `0 0 20px ${gradientColors[2]}80`,
                `0 0 20px ${gradientColors[3]}80`,
                `0 0 20px ${gradientColors[4]}80`,
                `0 0 20px ${gradientColors[5]}80`,
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <Icon size={28} className="text-primary relative z-10" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProgressBar = ({ progress }) => {
  const { theme } = useThemeStore();
  const formattedProgress = progress.toFixed(2);

  const gradient = theme === 'dark'
    ? progress <= 33
      ? 'from-blue-500 to-cyan-500'
      : progress <= 66
      ? 'from-cyan-500 to-purple-500'
      : 'from-purple-500 to-indigo-500'
    : progress <= 33
    ? 'from-blue-600 to-cyan-600'
    : progress <= 66
    ? 'from-cyan-600 to-purple-600'
    : 'from-purple-600 to-indigo-600';

  return (
    <div className="flex items-center gap-3 w-full max-w-[200px]">
      <div className="relative flex-1 h-3 rounded-full overflow-hidden bg-base-300/50 dark:bg-base-200/50">
        <motion.div
          className={`absolute h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2),transparent)]"
            animate={{ backgroundPosition: ['0%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
      <motion.div
        className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, backgroundPosition: '0%' }}
        animate={{
          opacity: 1,
          backgroundPosition: ['0%', '100%'],
        }}
        transition={{
          opacity: { delay: 0.6 }, // Matches delay from StatsCard
          backgroundPosition: {
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {formattedProgress}%
      </motion.div>
    </div>
  );
};

const CoupeTextCard = ({ coupeText, theme }) => {
  return (
    <motion.div
      className="relative bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-base-300 dark:border-base-content/10 hover:border-primary/30 transition-all overflow-hidden group"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5 }}
    >
      <motion.div
        className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.h3
            className="text-lg font-semibold text-base-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Text Pair #{coupeText.id}
          </motion.h3>
          <motion.div
            className="p-2 rounded-lg bg-primary/10"
            whileHover={{ rotate: 10 }}
          >
            <FiType size={20} className="text-primary" />
          </motion.div>
        </div>
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-base-content/80">
            <span className="font-medium text-primary">Text 1:</span> {coupeText.text1}
          </p>
          <p className="text-sm text-base-content/80">
            <span className="font-medium text-secondary">Text 2:</span> {coupeText.text2}
          </p>
          {coupeText.annotationDate && coupeText.annotatedClass ? (
            <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-primary font-medium">
                Annotated Class: <span className="text-secondary">{coupeText.annotatedClass}</span>
              </p>
              <p className="text-sm text-base-content/70 mt-1">
                Annotated On: {new Date(coupeText.annotationDate).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-base-content/50 italic mt-3">Not yet annotated</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const AnnotatorRow = ({ annotator, datasetId, onUnassign }) => {
  const { theme } = useThemeStore();

  return (
    <motion.tr
      className="border-b border-base-300/10 hover:bg-base-200/80 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80 }}
    >
      <td className="py-4 px-6 text-base-content">{annotator.id}</td>
      <td className="py-4 px-6 text-base-content">{`${annotator.prenom} ${annotator.nom}`}</td>
      <td className="py-4 px-6 text-base-content">{annotator.username}</td>
      <td className="py-4 px-6 text-base-content">{annotator.email}</td>
      <td className="py-4 px-6">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            annotator.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
          }`}
        >
          {annotator.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-4 px-6 text-base-content">{annotator.taskCount}</td>
      <td className="py-4 px-6">
        {annotator.canUnassign && (
          <motion.button
            onClick={() => onUnassign(annotator.id)}
            className="flex items-center px-3 py-1 rounded-lg bg-error/20 text-error hover:bg-error/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiUserMinus className="mr-2" size={16} />
            Unassign
          </motion.button>
        )}
      </td>
    </motion.tr>
  );
};

const DatasetDetails = () => {
  const { datasetId: id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useThemeStore();
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  // Fetch dataset details
  const { data: datasetResponse, error: datasetError, isLoading: isDatasetLoading } = useQuery({
    queryKey: ['datasetDetails', id],
    queryFn: () => getDatasetDetails(id),
  });

  // Fetch coupe textes
  const { data: coupeTextesResponse, error: coupeTextesError, isLoading: isCoupeTextesLoading } = useQuery({
    queryKey: ['coupeTextes', id, currentPage, pageSize],
    queryFn: () => getCoupeTextesByDatasetId(id, currentPage, pageSize),
    keepPreviousData: true,
  });

  // Mutation for unassigning an annotator
  const unassignMutation = useMutation({
    mutationFn: ({ datasetId, annotatorId }) => unassignAnnotatorFromDataset(datasetId, annotatorId),
    onSuccess: () => {
      setNotification({ message: 'Annotator unassigned successfully', type: 'success' });
      queryClient.invalidateQueries(['coupeTextes', id, currentPage, pageSize]);
    },
    onError: (error) => {
      setNotification({ message: error.message, type: 'error' });
    },
  });

  const handleUnassign = (annotatorId) => {
    unassignMutation.mutate({ datasetId: id, annotatorId });
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < (coupeTextesResponse?.data?.totalPages - 1)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter annotators locally based on search term
  const filteredAnnotators = coupeTextesResponse?.data?.annotators?.filter(annotator =>
    annotator.id.toString().includes(searchTerm.toLowerCase()) ||
    annotator.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    annotator.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    annotator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    annotator.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isDatasetLoading || isCoupeTextesLoading) return <Loading />;
  if (datasetError) {
    return <Notification message={datasetError.message} type="error" onClose={() => {}} />;
  }
  if (coupeTextesError) {
    return <Notification message={coupeTextesError.message} type="error" onClose={() => {}} />;
  }

  const dataset = datasetResponse?.data || {};
  const coupeTextes = coupeTextesResponse?.data?.coupeTextes || [];
  const totalCoupeTextes = coupeTextesResponse?.data?.totalElements || 0;
  const totalPages = coupeTextesResponse?.data?.totalPages || 0;
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalCoupeTextes);

  return (
    <motion.div
      className="min-h-screen pt-16 pb-16 pl-64 pr-6 space-y-8 bg-gradient-to-br from-base-200/60 to-base-100/60 dark:from-base-100/60 dark:to-base-200/60"
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

      {/* Header */}
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
            Dataset: {dataset.name || 'Details'}
          </motion.h1>
          <motion.p
            className="text-base-content/70 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Detailed information about the dataset
          </motion.p>
        </div>
        <motion.button
          onClick={() => navigate('/datasets')}
          className="flex items-center px-5 py-3 rounded-xl bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 text-base-content font-medium transition-all shadow-md hover:shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
          Back to Datasets
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent rounded-3xl"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          <StatsCard
            title="Total Text Pairs"
            value={dataset.totalCoupeTextes || 0}
            icon={FiDatabase}
            color="primary"
            delay={0.1}
          />
          <StatsCard
            title="Annotated Text Pairs"
            value={dataset.numberOfAnnotatedCoupeTextes || 0}
            icon={FiCheckCircle}
            color="success"
            delay={0.2}
          />
          <StatsCard
            title="Not Annotated Text Pairs"
            value={dataset.numberOfNotAnnotatedCoupeTextes || 0}
            icon={FiXCircle}
            color="error"
            delay={0.3}
          />
          <StatsCard
            title="Progress"
            value={<ProgressBar progress={dataset.progress || 0} />}
            icon={FiActivity}
            color="info"
            delay={0.4}
          />
        </motion.div>
      </div>

      {/* Dataset Info Card */}
      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"
          animate={{
            opacity: [0.05, 0.1, 0.05],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <div className="relative z-10">
          <motion.h2
            className="text-xl font-semibold flex items-center text-base-content mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <FiDatabase className="mr-2 text-primary" size={20} />
            Dataset Information
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, staggerChildren: 0.1 }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <p className="text-sm font-medium text-base-content/70">ID</p>
              <p className="text-lg font-bold text-base-content">{dataset.id}</p>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <p className="text-sm font-medium text-base-content/70">Name</p>
              <p className="text-lg font-bold text-base-content">{dataset.name}</p>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2">
              <p className="text-sm font-medium text-base-content/70">Description</p>
              <p className="text-base text-base-content">{dataset.description || 'No description available'}</p>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2">
              <p className="text-sm font-medium text-base-content/70">Classes</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <AnimatePresence>
                  {dataset.classes?.map((className, index) => (
                    <motion.span
                      key={`${className}-${index}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary shadow-md"
                      initial={{ scale: 0, rotateY: 90 }}
                      animate={{ scale: 1, rotateY: 0 }}
                      exit={{ scale: 0, rotateY: -90 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {className}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Annotators Table with Search */}
      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {/* Search Input */}
        <div className="p-6 border-b border-base-300/10 flex justify-between items-center bg-gradient-to-r from-primary/5 to-secondary/5">
          <motion.h2
            className="text-xl font-semibold flex items-center text-base-content drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <FiType className="mr-2 text-primary" size={20} />
            Assigned Annotators
          </motion.h2>
          <motion.div
            className="relative flex-1 max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ y: -2 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-base-content/50" size={16} />
            </div>
            <input
              type="text"
              placeholder="Search annotators..."
              className="w-full pl-10 pr-4 py-2 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base-content"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-base-300/10 text-base-content/70">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Task Count</th>
                <th className="py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAnnotators.length === 0 ? (
                  <motion.tr
                    className="col-span-full text-center text-base-content/70 p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="7" className="py-8">
                      No annotators found matching your search.
                    </td>
                  </motion.tr>
                ) : (
                  filteredAnnotators.map((annotator, index) => (
                    <AnnotatorRow
                      key={annotator.id}
                      annotator={annotator}
                      datasetId={id}
                      onUnassign={handleUnassign}
                    />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <motion.p
          className="p-6 text-sm text-base-content/70 drop-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Total Annotators: {filteredAnnotators.length}
        </motion.p>
      </motion.div>

      {/* Coupe Textes List */}
      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="p-6 border-b border-base-300/10 flex justify-between items-center bg-gradient-to-r from-primary/5 to-secondary/5">
          <motion.h2
            className="text-xl font-semibold flex items-center text-base-content drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <FiType className="mr-2 text-primary" size={20} />
            Text Pairs
          </motion.h2>
          <motion.p
            className="text-sm text-base-content/70 drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Showing {startIndex}-{endIndex} of {totalCoupeTextes} text pairs
          </motion.p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {coupeTextes.length === 0 ? (
              <motion.div
                className="col-span-full text-center text-base-content/70 p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No text pairs found for this dataset.
              </motion.div>
            ) : (
              coupeTextes.map((coupeText, index) => (
                <motion.div
                  key={coupeText.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 1 + index * 0.1, type: 'spring', stiffness: 80 },
                  }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CoupeTextCard coupeText={coupeText} theme={theme} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalCoupeTextes > 0 && (
          <motion.div
            className="p-6 flex justify-between items-center bg-gradient-to-r from-primary/5 to-secondary/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="flex items-center px-4 py-2 bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 rounded-xl text-base-content font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center px-4 py-2 bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 rounded-xl text-base-content font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: currentPage >= totalPages - 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage >= totalPages - 1 ? 1 : 0.95 }}
            >
              Next
              <FiChevronRight className="ml-2" size={16} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DatasetDetails;