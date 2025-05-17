import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiBell,
  FiKey,
  FiTrash2,
  FiSun,
  FiMoon,
  FiSave,
  FiX,
  FiSettings,
} from "react-icons/fi";
import useThemeStore from "../store/themeStore";
import Notification from "../components/common/Notification";

const Settings = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    pushNotifications: false,
    activityAlerts: true,
  });
  const [isChanged, setIsChanged] = useState(false);
  const [notification, setNotification] = useState(null);

  // Track changes to enable/disable save button
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs((prev) => ({ ...prev, [name]: checked }));
    setIsChanged(true);
  };

  const handleSave = () => {
    // Simulate saving settings (e.g., API call)
    setNotification({
      message: "Settings saved successfully!",
      type: "success",
    });
    setIsChanged(false);
  };

  const handleCancel = () => {
    // Reset to initial values
    setUserProfile({ name: "John Doe", email: "john.doe@example.com" });
    setNotificationPrefs({
      emailNotifications: true,
      pushNotifications: false,
      activityAlerts: true,
    });
    setIsChanged(false);
    setNotification({ message: "Changes discarded.", type: "info" });
  };

  const handlePasswordReset = () => {
    // Simulate password reset (e.g., send email)
    setNotification({ message: "Password reset email sent!", type: "success" });
  };

  const handleAccountDeletion = () => {
    // Simulate account deletion confirmation
    setNotification({
      message: "Account deletion request submitted.",
      type: "warning",
    });
  };

  return (
    <motion.div
      className="min-h-screen space-y-4 sm:space-y-6 md:space-y-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Notification */}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiSettings className="mr-2" />
          Settings
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base text-base-content/70 mt-1 sm:mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Customize your experience and manage your account.
        </motion.p>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Settings Area */}
        <motion.div
          className="lg:col-span-2 space-y-4 sm:space-y-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* User Profile Section */}
          <motion.div
            className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-base-content flex items-center">
              <FiUser className="mr-2 text-primary" />
              User Profile
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-1">
                  Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  <input
                    type="text"
                    name="name"
                    value={userProfile.name}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 bg-base-300 dark:bg-base-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-1">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  <input
                    type="email"
                    name="email"
                    value={userProfile.email}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 bg-base-300 dark:bg-base-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification Preferences Section */}
          <motion.div
            className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-base-content flex items-center">
              <FiBell className="mr-2 text-primary" />
              Notification Preferences
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={notificationPrefs.emailNotifications}
                  onChange={handleNotificationChange}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-base-300 text-primary focus:ring-primary/50"
                />
                <label className="text-sm sm:text-base text-base-content/80">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={notificationPrefs.pushNotifications}
                  onChange={handleNotificationChange}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-base-300 text-primary focus:ring-primary/50"
                />
                <label className="text-sm sm:text-base text-base-content/80">
                  Push Notifications
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="activityAlerts"
                  checked={notificationPrefs.activityAlerts}
                  onChange={handleNotificationChange}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-base-300 text-primary focus:ring-primary/50"
                />
                <label className="text-sm sm:text-base text-base-content/80">
                  Activity Alerts
                </label>
              </div>
            </div>
          </motion.div>

          {/* Account Settings Section */}
          <motion.div
            className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-base-content flex items-center">
              <FiKey className="mr-2 text-primary" />
              Account Settings
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <motion.button
                onClick={handlePasswordReset}
                className="flex items-center px-3 sm:px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors text-sm sm:text-base"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <FiKey className="mr-2" />
                Reset Password
              </motion.button>
              <motion.button
                onClick={handleAccountDeletion}
                className="flex items-center px-3 sm:px-4 py-2 rounded-lg bg-error/10 text-error hover:bg-error/20 dark:bg-error/20 dark:hover:bg-error/30 transition-colors text-sm sm:text-base"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <FiTrash2 className="mr-2" />
                Delete Account
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar/Additional Settings */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Theme Settings */}
          <motion.div
            className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-base-content flex items-center">
              {theme === "dark" ? (
                <FiMoon className="mr-2 text-primary" />
              ) : (
                <FiSun className="mr-2 text-primary" />
              )}
              Theme Settings
            </h2>
            <motion.button
              onClick={toggleTheme}
              className="flex items-center px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transition-all text-sm sm:text-base"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {theme === "dark" ? (
                <>
                  <FiSun className="mr-2" />
                  Switch to Light Mode
                </>
              ) : (
                <>
                  <FiMoon className="mr-2" />
                  Switch to Dark Mode
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Save/Cancel Actions */}
          <motion.div
            className="bg-base-200/60 dark:bg-base-100/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-base-300 dark:border-base-content/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-base-content flex items-center">
              <FiSave className="mr-2 text-primary" />
              Actions
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.button
                onClick={handleSave}
                disabled={!isChanged}
                className={`flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-white shadow-lg transition-all text-sm sm:text-base ${
                  isChanged
                    ? "bg-gradient-to-r from-primary to-secondary hover:shadow-primary/30"
                    : "bg-base-300 dark:bg-base-200 cursor-not-allowed opacity-50"
                }`}
                whileHover={isChanged ? { scale: 1.03 } : {}}
                whileTap={isChanged ? { scale: 0.97 } : {}}
              >
                <FiSave className="mr-2" />
                Save Changes
              </motion.button>
              <motion.button
                onClick={handleCancel}
                disabled={!isChanged}
                className={`flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-sm sm:text-base ${
                  isChanged
                    ? "bg-base-300 dark:bg-base-200 text-base-content hover:bg-base-400 dark:hover:bg-base-300"
                    : "bg-base-300 dark:bg-base-200 cursor-not-allowed opacity-50"
                }`}
                whileHover={isChanged ? { scale: 1.03 } : {}}
                whileTap={isChanged ? { scale: 0.97 } : {}}
              >
                <FiX className="mr-2" />
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
