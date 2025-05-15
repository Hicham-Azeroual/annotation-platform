// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Notification from '../components/common/Notification';
import useAuthStore from '../store/authStore';
import { loginUser } from '../api/userService';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const { setUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // Capture the location to get the intended route

  // Check authentication state on mount
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the intended route or dashboard if none
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data);
        setNotification({ message: data.message, type: 'success' });
        // Redirect to the intended route or dashboard if none
        const from = location.state?.from?.pathname || '/dashboard';
        setTimeout(() => navigate(from, { replace: true }), 1000);
      } else {
        setNotification({ message: data.message || 'Login failed', type: 'error' });
      }
    },
    onError: (error) => {
      setNotification({ message: error.message || 'An error occurred', type: 'error' });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient p-4">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Tilt options={{ max: 25, scale: 1.05, speed: 400 }}>
        <motion.div
          className="glassmorphism p-8 rounded-2xl shadow-2xl w-full max-w-md"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-cyan-300">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                className="input-3d w-full"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="input-3d w-full pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <Button type="submit" disabled={mutation.isLoading} className="w-full">
              {mutation.isLoading ? <Loading /> : 'Login'}
            </Button>
          </form>
          <p className="text-center text-sm mt-4">
            Forgot your password?{' '}
            <a href="#" className="text-cyan-300 hover:underline">
              Reset it
            </a>
          </p>
        </motion.div>
      </Tilt>
    </div>
  );
};

export default Login;