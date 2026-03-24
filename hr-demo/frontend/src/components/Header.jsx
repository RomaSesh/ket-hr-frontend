import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    toast.info('Вы вышли из системы');
    navigate('/login');
  };

  return (
    <header className="main-header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src="/ket-logo.png" alt="КЭТ" className="logo-img" />
          <span>HR‑система КЭТ</span>
        </Link>
        {token && (
          <nav className="nav">
            <Link to="/employees">Сотрудники</Link>
            <Link to="/vacations">Отпуска</Link>
            <Link to="/vacancies">Вакансии</Link>
            <Link to="/reports">Отчёты</Link>
            <button onClick={handleLogout} className="logout-btn">Выйти</button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;