import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSave,
  FiX,
  FiCheckCircle,
  FiHardDrive,
  FiAlertTriangle,
} from "react-icons/fi";
import Loading from "../components/common/Loading";
import Notification from "../components/common/Notification";
import { getTaskByAnnotator, saveAnnotation } from "../api/tasksService";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";

// Particle effect for annotation success
const ParticleEffect = ({ trigger }) => {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 3,
  }));

  return (
    <AnimatePresence>
      {trigger && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-primary to-secondary"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: [1, 0],
                scale: [1, 0.5],
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Shake effect for disabled Next button
const ShakeEffect = ({ trigger }) => (
  <AnimatePresence>
    {trigger && (
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [-10, 10, -10, 10, 0] }}
        exit={{ x: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    )}
  </AnimatePresence>
);

const TaskDetail = () => {
  const { annotatorId, datasetId, page } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const [selectedClass, setSelectedClass] = useState(null);
  const [notification, setNotification] = useState(null);
  const [hoveredClass, setHoveredClass] = useState(null);
  const [showParticles, setShowParticles] = useState(false);
  const [isAnnotated, setIsAnnotated] = useState(false); // Track if task is annotated
  const [showNextWarning, setShowNextWarning] = useState(false); // Track Next button warning

  // Fetch task data
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["task", annotatorId, datasetId, page],
    queryFn: () => getTaskByAnnotator(annotatorId, datasetId, parseInt(page)),
    enabled: !!annotatorId && !!datasetId && !!page,
  });

  // Mutation for saving annotation
  const mutation = useMutation({
    mutationFn: (annotationData) => saveAnnotation(annotationData),
    onSuccess: () => {
      setIsAnnotated(true); // Mark task as annotated
      setNotification({
        message: "Annotation saved successfully! 🎉",
        type: "success",
      });
      setShowParticles(true);
      queryClient.invalidateQueries(["task", annotatorId, datasetId, page]);
      setTimeout(() => {
        setNotification(null);
        setShowParticles(false);
      }, 3000);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to save annotation",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  // Handle saving annotation
  const handleSaveAnnotation = () => {
    if (!selectedClass || !data?.data?.tasks[0]) {
      setNotification({
        message: "Please select a class to annotate",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    const annotationData = {
      annotatorId,
      coupeTexteId: data.data.tasks[0].coupeTexteId,
      classeChoisieId: selectedClass.id,
    };
    mutation.mutate(annotationData);
  };

  // Handle previous task navigation
  const handlePrevTask = () => {
    const prevPage = Math.max(0, parseInt(page) - 1);
    navigate(`/tasks/${annotatorId}/${datasetId}/${prevPage}`);
    setIsAnnotated(false); // Reset annotation state for new task
  };

  // Handle next task navigation with validation
  const handleNextTask = () => {
    if (!isAnnotated && !data?.data?.tasks[0]?.assignedClass) {
      setShowNextWarning(true);
      setNotification({
        message: "Please annotate this task before proceeding",
        type: "warning",
      });
      setTimeout(() => {
        setNotification(null);
        setShowNextWarning(false);
      }, 3000);
      return;
    }
    const nextPage = parseInt(page) + 1;
    navigate(`/tasks/${annotatorId}/${datasetId}/${nextPage}`);
    setIsAnnotated(false); // Reset annotation state for new task
  };

  // Set initial selected class if task is already annotated
  useEffect(() => {
    if (data?.data?.tasks[0]?.assignedClass) {
      const assigned = data.data.classes.find(
        (cls) => cls.nomClasse === data.data.tasks[0].assignedClass
      );
      setSelectedClass(assigned || null);
      setIsAnnotated(true); // Mark as annotated if assignedClass exists
    } else {
      setSelectedClass(null);
      setIsAnnotated(false);
    }
  }, [data]);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <Notification message={error.message} type="error" onClose={() => {}} />
    );

  const task = data?.data;
  const availableClasses = task?.classes || [];

  // Gradient colors for animations
  const gradientColors = [
    "#22D3EE", // Cyan
    "#D946EF", // Magenta
    "#3B82F6", // Electric Blue
    "#4ADE80", // Neon Green
    "#F472B6", // Hot Pink
    "#8B5CF6", // Violet
    "#22D3EE", // Loop back to Cyan
  ];

  return (
    <motion.div
      className="min-h-screen space-y-4 sm:space-y-6 md:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Notification with Particle Effect */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-20 right-4 sm:right-6 z-50"
            initial={{ opacity: 0, y: -50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -50, rotateX: -10 }}
            transition={{ duration: 0.5 }}
          >
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
            <ParticleEffect trigger={showParticles} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent rounded-2xl sm:rounded-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-lg"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0em" }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Task Annotation
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base lg:text-lg text-base-content/70 mt-1 sm:mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Annotate task for Dataset: {task?.datasetName} (Page{" "}
            {task?.currentPage + 1} of {task?.totalPages})
          </motion.p>
        </div>
        <motion.button
          onClick={() => navigate("/dashboard")}
          className={`relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary/80 to-secondary/80 dark:from-primary dark:to-secondary rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-xl text-sm sm:text-base ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
          whileHover={{
            scale: 1.05,
            boxShadow:
              theme === "dark"
                ? "0 10px 25px rgba(34, 211, 238, 0.3)"
                : "0 10px 25px rgba(6, 182, 212, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 border-2 border-transparent rounded-lg sm:rounded-xl"
            style={{
              borderImage: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]}) 1`,
            }}
            animate={{
              borderImage: gradientColors.map(
                (_, i, arr) =>
                  `linear-gradient(45deg, ${arr[i]}, ${
                    arr[(i + 1) % arr.length]
                  }) 1`
              ),
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative z-20 flex items-center">
            <FiX className="mr-2" /> Back to Dashboard
          </span>
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        key={page}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        {/* Task Details Card (Left) */}
        <motion.div
          className="relative col-span-1 bg-base-200/70 dark:bg-base-100/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-primary/20 transition-all overflow-hidden"
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          initial={{ opacity: 0, x: -50, rotateX: 10 }}
          animate={{ opacity: 1, x: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{
            y: -5,
            rotateX: 5,
            rotateY: 5,
            boxShadow:
              theme === "dark"
                ? "0 15px 40px rgba(34, 211, 238, 0.3)"
                : "0 15px 40px rgba(6, 182, 212, 0.3)",
          }}
        >
          <motion.div
            className="absolute inset-0 border-2 border-transparent rounded-2xl"
            style={{
              borderImage: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]}) 1`,
            }}
            animate={{
              borderImage: gradientColors.map(
                (_, i, arr) =>
                  `linear-gradient(45deg, ${arr[i]}, ${
                    arr[(i + 1) % arr.length]
                  }) 1`
              ),
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundImage: gradientColors.map(
                (color, i) =>
                  `radial-gradient(circle at ${(i % 2) * 60 + 20}% ${
                    (Math.floor(i / 2) % 2) * 60 + 20
                  }%, ${color}20, transparent 70%)`
              ),
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-base-content mb-3 sm:mb-4 flex items-center">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <FiHardDrive className="mr-2 text-primary" />
              </motion.div>
              Task Details
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-sm sm:text-base text-base-content/80 font-semibold">
                  Task ID:
                </span>
                <span className="text-sm sm:text-base text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {task?.taskId}
                </span>
              </motion.div>
              {/* Text 1 Card with Annotation Glow */}
              <motion.div
                className={`relative p-3 sm:p-4 bg-base-300/50 dark:bg-base-200/50 rounded-lg shadow-inner border transition-all ${
                  isAnnotated
                    ? "border-success/50 bg-success/10"
                    : "border-primary/30 hover:border-primary/50"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    theme === "dark"
                      ? "0 0 15px rgba(34, 211, 238, 0.3)"
                      : "0 0 15px rgba(6, 182, 212, 0.3)",
                }}
              >
                <motion.div
                  className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {isAnnotated && (
                  <motion.div
                    className="absolute top-2 right-2 text-success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiCheckCircle size={20} />
                  </motion.div>
                )}
                <p className="text-sm sm:text-base text-base-content/80 font-semibold mb-1 sm:mb-2">
                  Text 1:
                </p>
                <p className="text-sm sm:text-base text-base-content break-words">
                  {task?.tasks[0]?.text1 || "N/A"}
                </p>
              </motion.div>
              {/* Text 2 Card with Annotation Glow */}
              <motion.div
                className={`relative p-3 sm:p-4 bg-base-300/50 dark:bg-base-200/50 rounded-lg shadow-inner border transition-all ${
                  isAnnotated
                    ? "border-success/50 bg-success/10"
                    : "border-secondary/30 hover:border-secondary/50"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    theme === "dark"
                      ? "0 0 15px rgba(217, 70, 239, 0.3)"
                      : "0 0 15px rgba(168, 85, 247, 0.3)",
                }}
              >
                <motion.div
                  className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-secondary to-primary"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {isAnnotated && (
                  <motion.div
                    className="absolute top-2 right-2 text-success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiCheckCircle size={20} />
                  </motion.div>
                )}
                <p className="text-sm sm:text-base text-base-content/80 font-semibold mb-1 sm:mb-2">
                  Text 2:
                </p>
                <p className="text-sm sm:text-base text-base-content break-words">
                  {task?.tasks[0]?.text2 || "N/A"}
                </p>
              </motion.div>
              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-sm sm:text-base text-base-content/80 font-semibold">
                  Status:
                </span>
                <span
                  className={`relative px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                    task?.tasks[0]?.status === "TERMINEE"
                      ? "bg-success/20 text-success"
                      : "bg-warning/20 text-warning"
                  }`}
                >
                  {task?.tasks[0]?.status || "Pending"}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-current opacity-50"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Annotation Panel (Center) */}
        <motion.div
          className="relative col-span-1 lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Progress Bar */}
          <motion.div
            className="relative bg-base-300/50 dark:bg-base-200/50 rounded-full h-4 sm:h-6 overflow-hidden shadow-md"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-secondary h-full"
              style={{ width: `${task?.progress || 0}%` }}
              animate={{
                backgroundPosition: ["0%", "100%"],
                boxShadow: [
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                ],
              }}
              transition={{
                backgroundPosition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-base-content font-semibold text-xs sm:text-sm bg-clip-text bg-gradient-to-r from-primary to-secondary text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Progress: {task?.progress.toFixed(2)}%
            </motion.div>
          </motion.div>

          {/* Annotation Card */}
          <motion.div
            className="relative bg-base-200/70 dark:bg-base-100/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-primary/20 transition-all overflow-hidden"
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            whileHover={{
              y: -5,
              rotateX: 5,
              rotateY: 5,
              boxShadow:
                theme === "dark"
                  ? "0 15px 40px rgba(34, 211, 238, 0.3)"
                  : "0 15px 40px rgba(6, 182, 212, 0.3)",
            }}
          >
            <motion.div
              className="absolute inset-0 border-2 border-transparent rounded-2xl"
              style={{
                borderImage: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]}) 1`,
              }}
              animate={{
                borderImage: gradientColors.map(
                  (_, i, arr) =>
                    `linear-gradient(45deg, ${arr[i]}, ${
                      arr[(i + 1) % arr.length]
                    }) 1`
                ),
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundImage: gradientColors.map(
                  (color, i) =>
                    `radial-gradient(circle at ${(i % 2) * 60 + 20}% ${
                      (Math.floor(i / 2) % 2) * 60 + 20
                    }%, ${color}20, transparent 70%)`
                ),
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10">
              <h2 className="text-lg sm:text-xl font-semibold text-base-content mb-3 sm:mb-4 flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
                >
                  <FiCheckCircle className="mr-2 text-success" />
                </motion.div>
                Select Annotation Class
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                {availableClasses.map((cls) => (
                  <motion.button
                    key={cls.id}
                    onMouseEnter={() => setHoveredClass(cls.id)}
                    onMouseLeave={() => setHoveredClass(null)}
                    onClick={() => setSelectedClass(cls)}
                    className={`relative p-2 sm:p-3 rounded-lg font-medium text-sm sm:text-base text-base-content transition-all shadow-sm border ${
                      selectedClass?.id === cls.id
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-base-300/50 dark:bg-base-200/50 border-base-300/50 dark:border-base-content/20 hover:bg-base-400/70 dark:hover:bg-base-300/70"
                    }`}
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        theme === "dark"
                          ? "0 0 15px rgba(34, 211, 238, 0.3)"
                          : "0 0 15px rgba(6, 182, 212, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-lg border border-primary/50"
                      animate={{
                        opacity: hoveredClass === cls.id ? [0.5, 1, 0.5] : 0,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: hoveredClass === cls.id ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    />
                    {selectedClass?.id === cls.id && (
                      <motion.div
                        className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-success rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <FiCheckCircle className="text-white text-[10px] sm:text-xs" />
                      </motion.div>
                    )}
                    {cls.nomClasse}
                  </motion.button>
                ))}
              </div>
              <motion.button
                onClick={handleSaveAnnotation}
                disabled={
                  !selectedClass ||
                  mutation.isLoading ||
                  availableClasses.length === 0
                }
                className={`relative w-full flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-success/80 to-success dark:from-success dark:to-success/90 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all disabled:bg-success/50 disabled:cursor-not-allowed text-sm sm:text-base ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: mutation.isLoading ? [0, 360] : 0 }}
                transition={{
                  duration: 1,
                  repeat: mutation.isLoading ? Infinity : 0,
                }}
              >
                <motion.div
                  className="absolute inset-0 border-2 border-transparent rounded-xl"
                  style={{
                    borderImage: `linear-gradient(45deg, #10B981, #34D399) 1`,
                  }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative z-20 flex items-center">
                  <FiSave className="mr-2" />{" "}
                  {mutation.isLoading ? "Saving..." : "Save Annotation"}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Navigation Footer */}
      <motion.div
        className="relative flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mt-4 sm:mt-6 md:mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent rounded-2xl sm:rounded-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.button
          onClick={handlePrevTask}
          disabled={parseInt(page) === 0}
          className={`relative flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary/80 to-secondary/80 dark:from-primary dark:to-secondary rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
          whileHover={{
            scale: 1.05,
            boxShadow:
              theme === "dark"
                ? "0 10px 25px rgba(34, 211, 238, 0.3)"
                : "0 10px 25px rgba(6, 182, 212, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 border-2 border-transparent rounded-xl"
            style={{
              borderImage: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]}) 1`,
            }}
            animate={{
              borderImage: gradientColors.map(
                (_, i, arr) =>
                  `linear-gradient(45deg, ${arr[i]}, ${
                    arr[(i + 1) % arr.length]
                  }) 1`
              ),
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative z-20 flex items-center">
            <FiChevronLeft className="mr-2" /> Previous
          </span>
        </motion.button>
        <motion.span
          className="text-sm sm:text-base text-base-content/70 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Page {task?.currentPage + 1} of {task?.totalPages} (Total Tasks:{" "}
          {task?.totalTasks})
        </motion.span>
        <motion.button
          onClick={handleNextTask}
          disabled={
            task?.currentPage + 1 >= task?.totalPages ||
            (!isAnnotated && !data?.data?.tasks[0]?.assignedClass)
          }
          className={`relative flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary/80 to-secondary/80 dark:from-primary dark:to-secondary rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
          whileHover={{
            scale: 1.05,
            boxShadow:
              theme === "dark"
                ? "0 10px 25px rgba(34, 211, 238, 0.3)"
                : "0 10px 25px rgba(6, 182, 212, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ShakeEffect trigger={showNextWarning} />
          {/* Warning Tooltip */}
          <AnimatePresence>
            {showNextWarning && (
              <motion.div
                className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-warning/90 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <FiAlertTriangle className="mr-1" /> Annotate first!
              </motion.div>
            )}
          </AnimatePresence>
          <span className="relative z-20 flex items-center">
            Next <FiChevronRight className="ml-2" />
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default TaskDetail;
