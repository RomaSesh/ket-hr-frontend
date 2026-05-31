import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', icon: '📊', label: 'Дашборд', roles: ['admin', 'hr', 'manager', 'employee'] },
  { path: '/employees', icon: '👥', label: 'Сотрудники', roles: ['admin', 'hr', 'manager', 'employee'] },
  { path: '/departments', icon: '🏛️', label: 'Отделения/Кафедры', roles: ['admin', 'hr', 'manager', 'employee'] },
  { path: '/vacations', icon: '🏖️', label: 'Отпуска', roles: ['admin', 'hr', 'manager', 'employee'] },
  { path: '/vacancies', icon: '📋', label: 'Вакансии', roles: ['admin', 'hr'] },
  { path: '/reports', icon: '📈', label: 'Отчёты', roles: ['admin', 'hr'] },
  { path: '/settings', icon: '⚙️', label: 'Настройки', roles: ['admin', 'hr', 'manager', 'employee'] },
  { path: '/help', icon: '❓', label: 'Помощь', roles: ['admin', 'hr', 'manager', 'employee'] },
  { path: '/admin/users', icon: '👑', label: 'Администрирование', roles: ['admin'] },
];

const Sidebar = () => {
  // Получаем роль пользователя
  let userRole = 'employee';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      userRole = user.role || 'employee';
    }
  } catch (e) {
    console.error('Ошибка парсинга user в Sidebar', e);
  }

  // Фильтруем пункты меню по роли
  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="fixed left-0 top-[73px] w-64 h-[calc(100vh-73px)] bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      <nav className="flex flex-col py-4">
        {filteredMenu.map((item) => (
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