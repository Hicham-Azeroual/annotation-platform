import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardUser from './pages/DashboardUser';
import Layout from './components/layout/Layout';
import Annotators from './pages/Annotators';
import ProtectedRoute from './components/ProtectedRoute';
import Datasets from './pages/Datasets';
import DatasetDetails from './pages/DatasetDetails';
import AssignAnnotators from './pages/AssignAnnotators';
import Tasks from './pages/Tasks';
import MyWork from './pages/MyWork';
import History from './pages/History';
import Settings from './pages/Settings';
import SettingsUser from './pages/SettingsUser';
import TaskDetail from './pages/TaskDetail';

const queryClient = new QueryClient();

const App = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            {/* Admin-specific routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/datasets/:datasetId" element={<DatasetDetails />} />
            <Route path="/annotators" element={<Annotators />} />
            <Route path="/datasets/:datasetId/assign" element={<AssignAnnotators />} />
            <Route path="/settings" element={<Settings />} />
            {/* User-specific routes */}
            <Route path="/dashboard-user" element={<DashboardUser />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:annotatorId/:datasetId/:page" element={<TaskDetail></TaskDetail>} />
            <Route path="/my-work" element={<MyWork />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings-user" element={<SettingsUser />} />
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default App;