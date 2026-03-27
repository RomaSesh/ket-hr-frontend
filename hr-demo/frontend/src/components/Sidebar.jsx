import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', icon: '📊', label: 'Дашборд' },
  { path: '/employees', icon: '👥', label: 'Сотрудники' },
  { path: '/departments', icon: '🏛️', label: 'Отделения/Кафедры' },
  { path: '/reports', icon: '📈', label: 'Отчеты' },
  { path: '/settings', icon: '⚙️', label: 'Настройки' },
  { path: '/help', icon: '❓', label: 'Помощь' },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-[73px] w-64 h-[calc(100vh-73px)] bg-white border-r border-gray-200 shadow-sm">
      <nav className="flex flex-col py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;