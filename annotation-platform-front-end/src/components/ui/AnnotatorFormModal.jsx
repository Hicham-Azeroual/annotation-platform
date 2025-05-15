import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiKey, FiCheckCircle } from 'react-icons/fi';
import { useEffect,useState } from 'react';
const AnnotatorFormModal = ({ isOpen, onClose, annotator }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    status: 'active',
    role: 'annotator'
  });

  useEffect(() => {
    if (annotator) {
      setFormData({
        name: annotator.name || '',
        email: annotator.email || '',
        username: annotator.username || '',
        status: annotator.status || 'active',
        role: annotator.role || 'annotator'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        username: '',
        status: 'active',
        role: 'annotator'
      });
    }
  }, [annotator]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (API call)
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-base-100 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {annotator ? 'Edit Annotator' : 'Add New Annotator'}
                </h2>
                <button
                  className="p-1 rounded-full hover:bg-base-200 transition-colors"
                  onClick={onClose}
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-base-content/70" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 pr-4 py-2 bg-base-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-base-content/70" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 pr-4 py-2 bg-base-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-base-content/70" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="pl-10 pr-4 py-2 bg-base-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="johndoe"
                        required
                      />
                    </div>
                  </div>

                  {!annotator && (
                    <div>
                      <label className="block text-sm font-medium text-base-content/70 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiKey className="text-base-content/70" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          className="pl-10 pr-4 py-2 bg-base-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-base-content/70 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="bg-base-200 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-base-content/70 mb-1">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="bg-base-200 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="annotator">Annotator</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <motion.button
                    type="button"
                    className="px-4 py-2 bg-base-200 hover:bg-base-300 rounded-lg transition-colors"
                    onClick={onClose}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiCheckCircle className="mr-2" />
                    {annotator ? 'Update Annotator' : 'Create Annotator'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnotatorFormModal;