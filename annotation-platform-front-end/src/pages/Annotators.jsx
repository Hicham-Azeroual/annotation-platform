import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllAnnotators,
  getAnnotatorById,
  createAnnotator,
  updateAnnotator,
  deleteAnnotator,
} from "../api/annotatorService";
import Loading from "../components/common/Loading";
import Notification from "../components/common/Notification";
import StatsCard from "../features/annotators/StatsCard";
import AnnotatorModal from "../features/annotators/AnnotatorModal";
import DeleteConfirmModal from "../features/annotators/DeleteConfirmModal";
import AnnotatorsTable from "../features/annotators/AnnotatorsTable";
import SearchAndFilter from "../features/annotators/SearchAndFilter";
import { FiPlus } from "react-icons/fi";
const Annotators = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnnotator, setSelectedAnnotator] = useState(null);
  const [notification, setNotification] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Query for annotators data
  const { data, error, isLoading } = useQuery({
    queryKey: ["annotators"],
    queryFn: getAllAnnotators,
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
          }
          return 0;
        })
    : [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: createAnnotator,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(["annotators"]);
        setNotification({ message: response.message, type: "success" });
        setIsAddModalOpen(false);
      } else {
        setNotification({ message: response.message, type: "error" });
      }
    },
    onError: () => {
      setNotification({ message: "Failed to create annotator", type: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, annotator }) => updateAnnotator(id, annotator),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(["annotators"]);
        setNotification({ message: response.message, type: "success" });
        setIsEditModalOpen(false);
      } else {
        setNotification({ message: response.message, type: "error" });
      }
    },
    onError: () => {
      setNotification({ message: "Failed to update annotator", type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnotator,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(["annotators"]);
        setNotification({ message: response.message, type: "success" });
        setIsDeleteModalOpen(false);
      } else {
        setNotification({ message: response.message, type: "error" });
      }
    },
    onError: () => {
      setNotification({
        message: "Failed to deactivate annotator",
        type: "error",
      });
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
      setNotification({ message: response.message, type: "error" });
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
  if (error)
    return (
      <Notification message={error.message} type="error" onClose={() => {}} />
    );

  const annotators = data?.data || [];
  const totalAnnotators = annotators.length;
  const activeAnnotators = annotators.filter((a) => a.active).length;
  const inactiveAnnotators = totalAnnotators - activeAnnotators;

  return (
    <motion.div
      className="min-h-screen space-y-4 sm:space-y-6 md:space-y-8"
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
            Annotators Management
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base text-base-content/70 mt-1 sm:mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Manage and organize your team of annotators
          </motion.p>
        </div>

        <motion.button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all group text-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.3)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          <FiPlus className="mr-2 group-hover:rotate-90 transition-transform w-4 h-4 sm:w-5 sm:h-5" />
          Add Annotator
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
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
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 p-4 sm:p-5 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </motion.div>

      {/* Annotators Table */}
      <motion.div
        className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-base-300 dark:border-base-content/10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <AnnotatorsTable
          filteredAnnotators={filteredAnnotators}
          totalAnnotators={totalAnnotators}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
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
