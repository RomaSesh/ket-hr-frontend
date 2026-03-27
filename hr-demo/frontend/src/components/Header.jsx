import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    toast.info('Вы вышли из системы');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">КЭТ</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Управление сотрудниками</h1>
            <p className="text-xs text-gray-500">Костромской энергетический техникум</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            🔔
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-700 font-medium">
                {user.full_name ? user.full_name[0] : 'И'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {user.full_name || 'Иванова Е.П.'}
              </p>
              <p className="text-xs text-gray-500">Отдел кадров</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;