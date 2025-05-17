import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiKey, FiXCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
const AnnotatorModal = ({
  isOpen,
  onClose,
  annotator,
  onSubmit,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    username: "",
    email: "",
    active: true,
    regeneratePassword: false,
  });

  useEffect(() => {
    if (annotator) {
      setFormData({
        nom: annotator.nom || "",
        prenom: annotator.prenom || "",
        username: annotator.username || "",
        email: annotator.email || "",
        active: annotator.active ?? true,
        regeneratePassword: false,
      });
    }
  }, [annotator]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-primary/20 max-w-lg w-full relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.div
              className="absolute -top-20 -right-20 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-primary/10 blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <motion.h2
                  className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {isEdit ? "Edit Annotator" : "Add Annotator"}
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-base-200 transition-colors"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiXCircle className="w-5 h-5 sm:w-6 sm:h-6 text-base-content/70" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-base-content/70 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-base-content/70 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-base-content/70 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-base-content/70 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
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
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-base-300 text-primary focus:ring-primary/50"
                    />
                    <label className="ml-2 text-xs sm:text-sm text-base-content/80">
                      Active
                    </label>
                  </div>

                  {isEdit && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="regeneratePassword"
                        checked={formData.regeneratePassword}
                        onChange={handleChange}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded border-base-300 text-primary focus:ring-primary/50"
                      />
                      <label className="ml-2 text-xs sm:text-sm text-base-content/80 flex items-center">
                        <FiKey className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />{" "}
                        Regenerate Password
                      </label>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  className="flex justify-end gap-2 sm:gap-3 pt-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-base-200 text-base-content hover:bg-base-300 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.3)",
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isEdit ? "Update" : "Create"}
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

export default AnnotatorModal;
