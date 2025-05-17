import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiDatabase,
  FiEye,
  FiDownload,
  FiUserPlus,
  FiHash,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiSliders,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiPlus,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUpload,
} from "react-icons/fi";
import { Tilt } from "react-tilt";
import { useNavigate } from "react-router-dom";
import Loading from "../components/common/Loading";
import Notification from "../components/common/Notification";
import {
  getAllDatasets,
  getDatasetById,
  exportDataset,
  createDataset,
} from "../api/datasetService";
import useThemeStore from "../store/themeStore";

const StatsCard = ({ title, value, icon, color }) => {
  const { theme } = useThemeStore();

  const colorVariants = {
    primary: "from-blue-600 to-teal-600",
    success: "from-emerald-600 to-teal-600",
    error: "from-red-600 to-pink-600",
    warning: "from-amber-600 to-orange-600",
    info: "from-indigo-600 to-blue-600",
  };

  const IconComponent =
    {
      completed: FiCheckCircle,
      inProgress: FiActivity,
      unassigned: FiXCircle,
    }[icon] || FiDatabase;

  const gradientColors = [
    "#2563EB",
    "#10B981",
    "#9333EA",
    "#F59E0B",
    "#6B21A8",
    "#2563EB",
  ];

  return (
    <Tilt
      options={{
        max: 15,
        scale: 1.05,
        perspective: 1000,
        glare: true,
        "max-glare": 0.2,
      }}
    >
      <motion.div
        className="relative bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10 hover:border-primary/30 transition-all overflow-hidden group"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        whileHover={{ y: -5 }}
      >
        <motion.div
          className="absolute left-0 top-0 w-1 h-full"
          animate={{ backgroundColor: gradientColors }}
          transition={{
            backgroundColor: {
              duration: 12,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
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
            ],
            opacity: [0.1, 0.15, 0.1],
            rotate: [0, 10, 0],
          }}
          transition={{
            backgroundImage: {
              duration: 12,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
            opacity: {
              duration: 12,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
            rotate: {
              duration: 12,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
          }}
        />
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${colorVariants[color]} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.05 }}
          transition={{ delay: 0.2 }}
        />
        <div
          className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-${color}-500/10 rounded-bl-full transition-all duration-500 group-hover:w-16 group-hover:h-16 sm:group-hover:w-20 sm:group-hover:h-20`}
        />
        <div className="relative z-10 flex justify-between items-center h-full">
          <div>
            <p className="text-xs sm:text-sm font-medium text-base-content/70 uppercase tracking-wider mb-1">
              {title}
            </p>
            <motion.p
              className="text-2xl sm:text-3xl font-bold text-base-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {value}
            </motion.p>
          </div>
          <motion.div
            className={`p-2 sm:p-3 rounded-lg bg-${color}-500/10 backdrop-blur-sm`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            whileHover={{ rotate: 10 }}
          >
            <IconComponent
              size={20}
              className={`text-${color}-600 sm:w-6 sm:h-6`}
            />
          </motion.div>
        </div>
      </motion.div>
    </Tilt>
  );
};

const LinearProgressBar = ({ progress }) => {
  const { theme } = useThemeStore();
  const formattedProgress = progress.toFixed(2);

  const colors = {
    low:
      theme === "dark"
        ? "from-indigo-500 to-teal-500"
        : "from-indigo-600 to-teal-600",
    medium:
      theme === "dark"
        ? "from-teal-500 to-purple-500"
        : "from-teal-600 to-purple-600",
    high:
      theme === "dark"
        ? "from-purple-500 to-blue-500"
        : "from-purple-600 to-blue-600",
  };

  const getGradient = () => {
    if (progress <= 33) return colors.low;
    if (progress <= 66) return colors.medium;
    return colors.high;
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-[150px]">
      <div className="relative flex-1 h-4 rounded-full overflow-hidden bg-base-300 dark:bg-base-200">
        <motion.div
          className={`absolute h-full rounded-full bg-gradient-to-r ${getGradient()}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.3),transparent,transparent)]"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 5px rgba(79, 70, 229, 0.3)",
              "0 0 10px rgba(79, 70, 229, 0.5)",
              "0 0 5px rgba(79, 70, 229, 0.3)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-xs font-medium text-base-content">
        {formattedProgress}%
      </span>
    </div>
  );
};

const CreateDatasetModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    classes: "",
    file: null,
  });
  const [classesArray, setClassesArray] = useState([]);
  const { theme } = useThemeStore();

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      classes: "",
      file: null,
    });
    setClassesArray([]);
  };

  useEffect(() => {
    const classes = formData.classes
      .split(";")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    setClassesArray(classes);
  }, [formData.classes]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("classes", classesArray.join(";"));
    if (formData.file) {
      submitData.append("file", formData.file);
    }
    // Pass resetForm as a callback to onSubmit
    onSubmit(submitData, resetForm);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-base-100 rounded-2xl p-8 shadow-2xl border border-primary/20 max-w-lg w-full relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
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
                  Create Dataset
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-base-200 transition-colors"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={20} className="text-base-content/70" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <FiDatabase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    <motion.input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                      style={{ pointerEvents: "auto" }}
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1">
                    Description
                  </label>
                  <motion.textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    rows={4}
                    style={{ pointerEvents: "auto" }}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1">
                    Classes (semicolon-separated)
                  </label>
                  <div className="mb-2">
                    <AnimatePresence>
                      {classesArray.map((className, index) => (
                        <motion.span
                          key={`${className}-${index}`}
                          className="inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-full text-sm font-medium bg-primary/10 text-primary shadow-sm"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          whileHover={{
                            scale: 1.1,
                            boxShadow:
                              theme === "dark"
                                ? "0 0 10px rgba(34, 211, 238, 0.5)"
                                : "0 0 10px rgba(6, 182, 212, 0.5)",
                          }}
                        >
                          {className}
                          <motion.button
                            type="button"
                            className="ml-2 focus:outline-none"
                            onClick={() => {
                              const newClasses = classesArray
                                .filter((_, i) => i !== index)
                                .join(";");
                              setFormData((prev) => ({
                                ...prev,
                                classes: newClasses,
                              }));
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            <FiX size={12} />
                          </motion.button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="relative">
                    <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    <motion.input
                      type="text"
                      name="classes"
                      value={formData.classes}
                      onChange={handleChange}
                      placeholder="e.g., class1;class2;class3"
                      className="w-full pl-10 pr-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      style={{ pointerEvents: "auto" }}
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1">
                    CSV File
                  </label>
                  <div className="relative">
                    <FiUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    <motion.input
                      type="file"
                      name="file"
                      accept=".csv"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-base-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                      style={{ pointerEvents: "auto" }}
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                <motion.div
                  className="flex justify-end space-x-3 pt-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
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
                      boxShadow:
                        theme === "dark"
                          ? "0 10px 25px -5px rgba(34, 211, 238, 0.3)"
                          : "0 10px 25px -5px rgba(6, 182, 212, 0.3)",
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Create
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

const Datasets = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [notification, setNotification] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const { data, error, isLoading } = useQuery({
    queryKey: ["datasets", currentPage, pageSize],
    queryFn: () => getAllDatasets(currentPage, pageSize),
    keepPreviousData: true,
  });
  console.log(data);

  const createMutation = useMutation({
    mutationFn: ({ formData }) => createDataset(formData),
    onSuccess: (response, variables) => {
      if (response.success) {
        setNotification({ message: response.message, type: "success" });
        queryClient.invalidateQueries(["datasets"]);
        setIsCreateModalOpen(false);
        variables.resetForm();
      } else {
        let errorMessage = response.message;
        if (errorMessage.includes("name cannot be empty")) {
          errorMessage = "Please provide a valid dataset name.";
        } else if (errorMessage.includes("File cannot be empty")) {
          errorMessage = "Please upload a valid CSV file.";
        }
        setNotification({ message: errorMessage, type: "error" });
      }
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to create dataset",
        type: "error",
      });
    },
  });

  const filteredDatasets = data?.data?.datasets
    ? data.data.datasets
        .filter((dataset) => {
          const matchesSearch = dataset.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchesStatus =
            filters.status === "all" ||
            (filters.status === "completed" && dataset.progress >= 100) ||
            (filters.status === "notCompleted" &&
              dataset.progress < 100 &&
              dataset.progress > 0) ||
            (filters.status === "unassigned" && dataset.progress === 0);
          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          if (filters.sortBy === "name") {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return filters.sortOrder === "asc"
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          } else if (filters.sortBy === "id") {
            return filters.sortOrder === "asc" ? a.id - b.id : b.id - a.id;
          } else if (filters.sortBy === "progress") {
            return filters.sortOrder === "asc"
              ? a.progress - b.progress
              : b.progress - a.progress;
          }
          return 0;
        })
    : [];

  const handleDetails = async (id) => {
    try {
      const response = await getDatasetById(id);
      if (response.success) {
        navigate(`/datasets/${id}`, { state: { dataset: response.data } });
      } else {
        setNotification({ message: response.message, type: "error" });
      }
    } catch (err) {
      setNotification({
        message: "Failed to fetch dataset details",
        type: "error",
      });
    }
  };

  const handleExport = async (id) => {
    try {
      const blob = await exportDataset(id);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "text/csv" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `dataset_${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setNotification({
        message: "Dataset downloaded successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: error.message || "Failed to download dataset",
        type: "error",
      });
    }
  };

  const handleAssign = (id) => {
    navigate(`/datasets/${id}/assign`);
  };

  const handleCreateSubmit = (formData, resetForm) => {
    createMutation.mutate({ formData, resetForm });
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < data?.data?.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <Notification message={error.message} type="error" onClose={() => {}} />
    );

  const datasets = data?.data?.datasets || [];
  const totalDatasets = data?.data?.totalElements || 0;
  const totalPages = data?.data?.totalPages || 0;
  const completedDatasets = data?.data?.completedDatasets || 0;
  const notCompletedDatasets = data?.data?.notCompletedDatasets || 0;
  const unassignedDatasets = data?.data?.unassignedDatasets || 0;

  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalDatasets);

  return (
    <motion.div
      className="min-h-screen space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8"
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
            Datasets Management
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base text-base-content/70 mt-1 sm:mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Manage and organize your datasets
          </motion.p>
        </div>

        <motion.button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all group text-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{
            scale: 1.03,
            boxShadow:
              theme === "dark"
                ? "0 10px 25px -5px rgba(34, 211, 238, 0.3)"
                : "0 10px 25px -5px rgba(6, 182, 212, 0.3)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          <FiPlus className="mr-2 group-hover:rotate-90 transition-transform w-4 h-4 sm:w-5 sm:h-5" />
          Add Dataset
        </motion.button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <StatsCard
          title="Completed Datasets"
          value={completedDatasets}
          icon="completed"
          color="success"
        />
        <StatsCard
          title="In Progress Datasets"
          value={notCompletedDatasets}
          icon="inProgress"
          color="warning"
        />
        <StatsCard
          title="Unassigned Datasets"
          value={unassignedDatasets}
          icon="unassigned"
          color="error"
        />
      </motion.div>

      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 p-4 sm:p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <motion.div className="relative flex-1 w-full" whileHover={{ y: -2 }}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-base-content/50 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              placeholder="Search datasets..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-base-300 dark:bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm sm:text-base text-base-content"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
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
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-base-300/10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-base-content/70 mb-2 sm:mb-3">
                  Status
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {["all", "completed", "notCompleted", "unassigned"].map(
                    (status) => (
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
                        {status === "notCompleted"
                          ? "In Progress"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </motion.button>
                    )
                  )}
                </div>
              </div>
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
                    <option value="progress">Progress</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="text-base-content/50 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-base-content/70 mb-2 sm:mb-3">
                  Order
                </label>
                <div className="flex gap-2 sm:gap-3">
                  {["asc", "desc"].map((order) => (
                    <motion.button
                      key={order}
                      onClick={() =>
                        setFilters({ ...filters, sortOrder: order })
                      }
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

      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-4 sm:p-6 border-b border-base-300/10 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-primary/5 to-secondary/5">
          <motion.h2
            className="text-lg sm:text-xl font-semibold flex items-center text-base-content drop-shadow-md mb-2 sm:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <FiDatabase className="mr-2 text-primary" size={20} />
            Datasets List
          </motion.h2>
          <motion.p
            className="text-sm text-base-content/70 drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Showing {startIndex}-{endIndex} of {totalDatasets} datasets
          </motion.p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-gradient-to-r from-primary/20 to-secondary/20 text-base-content/90 text-xs sm:text-sm shadow-md">
                <th className="w-[80px] p-2 sm:p-4 text-left font-medium">
                  <FiHash
                    size={14}
                    className="inline mr-1 sm:mr-2 text-primary"
                  />
                  ID
                </th>
                <th className="w-[200px] p-2 sm:p-4 text-left font-medium">
                  <FiDatabase
                    size={14}
                    className="inline mr-1 sm:mr-2 text-primary"
                  />
                  Name
                </th>
                <th className="w-[150px] p-2 sm:p-4 text-left font-medium">
                  <FiActivity
                    size={14}
                    className="inline mr-1 sm:mr-2 text-primary"
                  />
                  Status
                </th>
                <th className="w-[200px] p-2 sm:p-4 text-left font-medium">
                  <FiClock
                    size={14}
                    className="inline mr-1 sm:mr-2 text-primary"
                  />
                  Progress
                </th>
                <th className="w-[150px] p-2 sm:p-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/10">
              <AnimatePresence>
                {filteredDatasets.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td
                      colSpan="5"
                      className="p-6 sm:p-8 text-center text-base-content/70 text-sm sm:text-base"
                    >
                      No datasets found matching your criteria.
                    </td>
                  </motion.tr>
                ) : (
                  filteredDatasets.map((dataset, index) => (
                    <motion.tr
                      key={dataset.id}
                      className={
                        `transition-all duration-300 group ` +
                        (index % 2 === 0
                          ? "bg-base-200/30 dark:bg-base-100/30"
                          : "bg-base-200/50 dark:bg-base-100/50")
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: 0.7 + index * 0.08,
                          type: "spring",
                          stiffness: 80,
                        },
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(34, 211, 238, 0.1), rgba(217, 70, 239, 0.1))",
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                        transition: { duration: 0.3 },
                      }}
                    >
                      <td className="w-[80px] p-2 sm:p-4 font-mono text-primary text-xs sm:text-sm truncate">
                        {dataset.id}
                      </td>
                      <td className="w-[200px] p-2 sm:p-4 font-medium text-base-content text-sm sm:text-base truncate">
                        {dataset.name}
                      </td>
                      <td className="w-[150px] p-2 sm:p-4">
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            dataset.progress >= 100
                              ? "bg-success/10 text-success"
                              : dataset.progress > 0
                              ? "bg-warning/10 text-warning"
                              : "bg-error/10 text-error"
                          }`}
                        >
                          {dataset.progress >= 100
                            ? "Completed"
                            : dataset.progress > 0
                            ? "In Progress"
                            : "Unassigned"}
                        </span>
                      </td>
                      <td className="w-[200px] p-2 sm:p-4">
                        <LinearProgressBar progress={dataset.progress} />
                      </td>
                      <td className="w-[150px] p-2 sm:p-4 text-right">
                        <div className="flex justify-end space-x-1 sm:space-x-2">
                          <motion.button
                            onClick={() => handleDetails(dataset.id)}
                            className="p-1.5 sm:p-2 rounded-lg bg-info/20 text-info hover:bg-info/30 transition-colors"
                            whileHover={{
                              scale: 1.1,
                              boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            title="Details"
                          >
                            <FiEye size={14} />
                          </motion.button>
                          {dataset.progress >= 100 && (
                            <motion.button
                              onClick={() => handleExport(dataset.id)}
                              className="p-1.5 sm:p-2 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
                              whileHover={{
                                scale: 1.1,
                                boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                              }}
                              whileTap={{ scale: 0.95 }}
                              title="Download"
                            >
                              <FiDownload size={14} />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => handleAssign(dataset.id)}
                            className="p-1.5 sm:p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                            whileHover={{
                              scale: 1.1,
                              boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            title="Assign"
                          >
                            <FiUserPlus size={14} />
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

        <div className="flex justify-between items-center p-4 sm:p-6 border-t border-base-300/10">
          <p className="text-sm sm:text-base text-base-content/70">
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="p-1.5 sm:p-2 rounded-lg bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: currentPage === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 0 ? 1 : 0.95 }}
            >
              <FiChevronLeft size={16} />
            </motion.button>
            <motion.button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="p-1.5 sm:p-2 rounded-lg bg-base-300 dark:bg-base-200 hover:bg-base-400 dark:hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: currentPage === totalPages - 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages - 1 ? 1 : 0.95 }}
            >
              <FiChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <CreateDatasetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </motion.div>
  );
};

export default Datasets;
