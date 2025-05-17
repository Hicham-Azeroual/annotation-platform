import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Tilt } from "react-tilt";
import {
  FiEye,
  FiEyeOff,
  FiBook,
  FiKey,
  FiMail,
  FiUser,
  FiAward,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import Notification from "../components/common/Notification";
import useAuthStore from "../store/authStore";
import { loginUser, forgotPassword } from "../api/userService";
import useThemeStore from "../store/themeStore";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState("");
  const { setUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  // Floating elements for background
  const annotationElements = [
    { icon: <FiBook />, text: "Highlight" },
    { icon: <FiAward />, text: "Tag" },
    { icon: <FiKey />, text: "Note" },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data);
        setNotification({ message: data.message, type: "success" });
        const from = location.state?.from?.pathname || "/dashboard";
        setTimeout(() => navigate(from, { replace: true }), 1000);
      } else {
        setNotification({
          message: data.message || "Login failed",
          type: "error",
        });
      }
    },
    onError: (error) => {
      setNotification({
        message: error.message || "An error occurred",
        type: "error",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      if (data.status === "success") {
        setNotification({ message: data.message, type: "success" });
        setTimeout(() => {
          setShowResetForm(false);
          setEmail("");
        }, 2000);
      } else {
        setNotification({
          message: data.message || "Password reset failed",
          type: "error",
        });
      }
    },
    onError: (error) => {
      setNotification({
        message: error.message || "An error occurred during password reset",
        type: "error",
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    resetMutation.mutate(email);
  };

  const toggleForm = (e) => {
    e.preventDefault();
    setShowResetForm(!showResetForm);
    setNotification(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Floating particles */}
      {[...Array(30)].map((_, index) => (
        <motion.div
          key={index}
          className={`absolute ${
            theme === "dark" ? "bg-primary" : "bg-info"
          } rounded-full opacity-30`}
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            zIndex: 0,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating annotation elements */}
      {annotationElements.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute flex items-center ${
            theme === "dark" ? "text-info/50" : "text-primary/50"
          } opacity-20 pointer-events-none`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: [
              null,
              Math.random() *
                window.innerWidth *
                (Math.random() > 0.5 ? 1 : -1),
            ],
            y: [
              null,
              Math.random() *
                window.innerHeight *
                (Math.random() > 0.5 ? 1 : -1),
            ],
            rotate: [null, Math.random() * 360],
          }}
          transition={{
            duration: 25 + Math.random() * 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            fontSize: `${1.5 + Math.random() * 1.5}rem`,
            zIndex: 0,
          }}
        >
          <span className="mr-1 sm:mr-2 text-lg sm:text-xl">{item.icon}</span>
          <span className="hidden sm:inline text-sm sm:text-base font-semibold tracking-wider">
            {item.text}
          </span>
        </motion.div>
      ))}

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[101]"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
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

      {/* Main Login Card */}
      <Tilt
        options={{
          max: 15,
          scale: 1.03,
          speed: 300,
          glare: true,
          "max-glare": 0.4,
        }}
      >
        <motion.div
          className="bg-base-200/70 dark:bg-base-100/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md border border-base-300 dark:border-base-content/10 overflow-hidden relative z-10"
          initial={{ opacity: 0, scale: 0.8, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.01,
            boxShadow:
              theme === "dark"
                ? "0 12px 30px -6px rgba(14, 165, 233, 0.2)"
                : "0 12px 30px -6px rgba(6, 182, 212, 0.2)",
          }}
        >
          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-80"
            animate={{
              backgroundImage: [
                `linear-gradient(45deg, ${
                  theme === "dark" ? "#0ea5e9" : "#3b82f6"
                }, ${theme === "dark" ? "#818cf8" : "#6366f1"})`,
                `linear-gradient(45deg, ${
                  theme === "dark" ? "#818cf8" : "#6366f1"
                }, ${theme === "dark" ? "#0ea5e9" : "#3b82f6"})`,
              ],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />

          {/* Theme Toggle Button */}
          <motion.div
            className="absolute top-4 right-4 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
          >
            <div
              className={`p-2 rounded-full bg-${
                theme === "dark" ? "primary/20" : "info/20"
              } border border-${
                theme === "dark" ? "primary/30" : "info/30"
              } text-${
                theme === "dark" ? "primary" : "info"
              } transition-all duration-300 shadow-md`}
            >
              {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </div>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <motion.div
              className="flex justify-center mb-4"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`p-3 rounded-full bg-${
                  theme === "dark" ? "primary/30" : "info/30"
                } border border-${
                  theme === "dark" ? "primary/50" : "info/50"
                } shadow-xl`}
              >
                <FiBook
                  className={`text-${theme === "dark" ? "primary" : "info"}`}
                  size={36}
                />
              </div>
            </motion.div>
            <motion.h1
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {showResetForm ? "Quantum Reset" : "AnnotatePro Portal"}
            </motion.h1>
            <motion.p
              className={`text-sm sm:text-base ${
                theme === "dark" ? "text-base-content/70" : "text-base-content"
              }`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {showResetForm
                ? "Enter your email to reset your password"
                : "Sign in to your account"}
            </motion.p>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {showResetForm ? (
              // Reset Form
              <motion.form
                key="reset"
                onSubmit={handleResetSubmit}
                className="space-y-6 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-base-content/80 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-base-content/50" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-300 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors dark:bg-base-200 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={resetMutation.isLoading || !email}
                  isLoading={resetMutation.isLoading}
                >
                  {resetMutation.isLoading
                    ? "Sending Reset Link..."
                    : "Send Reset Link"}
                </Button>
                <button
                  onClick={toggleForm}
                  className="w-full text-center text-sm text-primary hover:underline mt-4"
                >
                  Back to Login
                </button>
              </motion.form>
            ) : (
              // Login Form
              <motion.form
                key="login"
                onSubmit={handleLoginSubmit}
                className="space-y-6 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-base-content/80 mb-2"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-base-content/50" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={credentials.username}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-300 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors dark:bg-base-200 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-base-content/80 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiKey className="text-base-content/50" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-base-300 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors dark:bg-base-200 text-sm sm:text-base"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-base-content transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </motion.button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    loginMutation.isLoading ||
                    !credentials.username ||
                    !credentials.password
                  }
                  isLoading={loginMutation.isLoading}
                >
                  {loginMutation.isLoading ? "Signing In..." : "Sign In"}
                </Button>
                <button
                  onClick={toggleForm}
                  className="w-full text-center text-sm text-primary hover:underline mt-4"
                >
                  Forgot Password?
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </Tilt>
    </div>
  );
};

export default Login;
