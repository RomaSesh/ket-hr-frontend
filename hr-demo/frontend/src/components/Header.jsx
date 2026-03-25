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
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/ket-logo.png" alt="КЭТ" className="h-10 w-auto" />
            <span className="text-white font-bold text-xl hidden sm:inline">HR-система КЭТ</span>
          </Link>
          
          {token && (
            <nav className="flex items-center gap-1">
              <Link to="/dashboard" className="px-3 py-2 text-white hover:bg-primary-dark rounded-md transition-colors text-sm font-medium">
                Главная
              </Link>
              <Link to="/employees" className="px-3 py-2 text-white hover:bg-primary-dark rounded-md transition-colors text-sm font-medium">
                Сотрудники
              </Link>
              <Link to="/vacations" className="px-3 py-2 text-white hover:bg-primary-dark rounded-md transition-colors text-sm font-medium">
                Отпуска
              </Link>
              <Link to="/vacancies" className="px-3 py-2 text-white hover:bg-primary-dark rounded-md transition-colors text-sm font-medium">
                Вакансии
              </Link>
              <Link to="/reports" className="px-3 py-2 text-white hover:bg-primary-dark rounded-md transition-colors text-sm font-medium">
                Отчёты
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 text-white hover:bg-primary-dark rounded-md transition-colors text-sm font-medium"
              >
                Выйти
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;