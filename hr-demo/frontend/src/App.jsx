import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import EmployeeEdit from './pages/EmployeeEdit';
import Vacations from './pages/Vacations';
import Vacancies from './pages/Vacancies';
import Reports from './pages/Reports';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Settings from './pages/Settings';
import Help from './pages/Help';
import PrivateRoute from './components/PrivateRoute';
import api from './api/axios';
import './index.css';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await api.get('/auth/me');
        } catch (error) {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      } else if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
      <Route path="/employees/:id" element={<PrivateRoute><EmployeeDetail /></PrivateRoute>} />
      <Route path="/employees/:id/edit" element={<PrivateRoute><EmployeeEdit /></PrivateRoute>} />
      <Route path="/vacations" element={<PrivateRoute><Vacations /></PrivateRoute>} />
      <Route path="/vacancies" element={<PrivateRoute><Vacancies /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/departments" element={<PrivateRoute><Departments /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/help" element={<PrivateRoute><Help /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;