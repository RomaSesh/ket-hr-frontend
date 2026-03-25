import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Employees from './pages/Employees';
import Vacations from './pages/Vacations';
import Vacancies from './pages/Vacancies';
import Reports from './pages/Reports';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import './index.css';

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';
  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
        <Route path="/vacations" element={<PrivateRoute><Vacations /></PrivateRoute>} />
        <Route path="/vacancies" element={<PrivateRoute><Vacancies /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/employees" />} />
      </Routes>
    </>
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
