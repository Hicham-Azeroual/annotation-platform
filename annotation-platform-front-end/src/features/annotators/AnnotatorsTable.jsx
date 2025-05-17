import { motion, AnimatePresence } from "framer-motion";
import {
  FiHash,
  FiUser,
  FiMail,
  FiActivity,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
} from "react-icons/fi";

// Define a color palette for the user icons and backgrounds
const ICON_COLORS = [
  "text-primary",
  "text-success",
  "text-warning",
  "text-info",
  "text-secondary",
  "text-accent",
  "text-purple-500",
];

const BG_COLORS = [
  "bg-primary/10",
  "bg-success/10",
  "bg-warning/10",
  "bg-info/10",
  "bg-secondary/10",
  "bg-accent/10",
  "bg-purple-500/10",
];

const AnnotatorsTable = ({
  filteredAnnotators,
  totalAnnotators,
  handleEdit,
  handleDelete,
}) => {
  return (
    <motion.div
      className="bg-base-100/90 dark:bg-base-200/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-base-300/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="p-4 sm:p-6 border-b border-base-300/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <motion.h2
          className="text-lg sm:text-xl font-semibold flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <FiUsers className="mr-2 text-primary w-5 h-5 sm:w-6 sm:h-6" />
          Annotators List
        </motion.h2>
        <motion.p
          className="text-xs sm:text-sm text-base-content/70"
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
            <tr className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:bg-base-200/70 text-base-content/80 dark:text-base-content/90 text-xs sm:text-sm shadow-sm rounded-t-xl">
              <th className="p-3 sm:p-4 text-left font-medium w-16 sm:w-20">
                <FiHash size={14} className="inline mr-1 sm:mr-2" />
                ID
              </th>
              <th className="p-3 sm:p-4 text-center font-medium w-20">
                Picture
              </th>
              <th className="p-3 sm:p-4 text-left font-medium">
                <FiUser size={14} className="inline mr-1 sm:mr-2" />
                First Name
              </th>
              <th className="p-3 sm:p-4 text-left font-medium">
                <FiUser size={14} className="inline mr-1 sm:mr-2" />
                Last Name
              </th>
              <th className="p-3 sm:p-4 text-left font-medium">
                <FiMail size={14} className="inline mr-1 sm:mr-2" />
                Email
              </th>
              <th className="p-3 sm:p-4 text-left font-medium">
                <FiActivity size={14} className="inline mr-1 sm:mr-2" />
                Status
              </th>
              <th className="p-3 sm:p-4 text-right font-medium">Actions</th>
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
                  <td
                    colSpan="7"
                    className="p-6 sm:p-8 text-center text-sm sm:text-base text-base-content/50"
                  >
                    No annotators found matching your criteria.
                  </td>
                </motion.tr>
              ) : (
                filteredAnnotators.map((annotator, index) => (
                  <motion.tr
                    key={annotator.id}
                    className={`transition-colors duration-300 ${
                      index % 2 === 0
                        ? "bg-base-100/50 dark:bg-base-200/20"
                        : "bg-base-100/70 dark:bg-base-200/30"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.7 + index * 0.05 },
                    }}
                    exit={{ opacity: 0 }}
                    whileHover={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(34, 211, 238, 0.05), rgba(217, 70, 239, 0.05))",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                      rotateX: 2,
                      rotateY: 2,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <td className="p-3 sm:p-4 font-mono text-xs sm:text-sm text-primary/90 dark:text-primary">
                      {annotator.id}
                    </td>
                    <td className="p-3 sm:p-4 text-center">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full inline-flex items-center justify-center shadow-inner ${
                          BG_COLORS[index % BG_COLORS.length]
                        }`}
                      >
                        <FiUser
                          size={24}
                          className={`${
                            ICON_COLORS[index % ICON_COLORS.length]
                          }`}
                        />
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm text-base-content/90 dark:text-base-content">
                      {annotator.prenom}
                    </td>
                    <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm text-base-content/90 dark:text-base-content">
                      {annotator.nom}
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center">
                        <FiMail className="mr-1 sm:mr-2 text-base-content/50 dark:text-base-content/70 w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm text-base-content/90 dark:text-base-content">
                          {annotator.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <motion.div
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          annotator.active
                            ? "bg-success/10 text-success dark:bg-success/20 dark:text-success"
                            : "bg-error/10 text-error dark:bg-error/20 dark:text-error"
                        }`}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: annotator.active
                            ? "0 0 10px rgba(16, 185, 129, 0.3)"
                            : "0 0 10px rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        {annotator.active ? (
                          <>
                            <FiCheckCircle className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                            Active
                          </>
                        ) : (
                          <>
                            <FiXCircle className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                            Inactive
                          </>
                        )}
                      </motion.div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <motion.button
                          onClick={() => handleEdit(annotator.id)}
                          className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                          whileHover={{
                            scale: 1.1,
                            boxShadow: "0 0 10px rgba(34, 211, 238, 0.3)",
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(annotator)}
                          className="p-1.5 sm:p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 dark:bg-error/20 dark:hover:bg-error/30 transition-colors"
                          whileHover={{
                            scale: 1.1,
                            boxShadow: "0 0 10px rgba(239, 68, 68, 0.3)",
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
  );
};

export default AnnotatorsTable;
