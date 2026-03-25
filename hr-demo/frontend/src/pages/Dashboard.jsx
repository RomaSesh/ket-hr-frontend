import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const statsCards = [
    { title: "Всего сотрудников", value: "124", change: "+12%", icon: "👥", color: "bg-blue-500" },
    { title: "В отпуске", value: "8", change: "-2%", icon: "🏖️", color: "bg-green-500" },
    { title: "Открытых вакансий", value: "5", change: "+3", icon: "📋", color: "bg-purple-500" },
    { title: "Заявок на отпуск", value: "12", change: "+4", icon: "📅", color: "bg-orange-500" },
  ];

  const recentActivities = [
    { user: "Иванов Иван", action: "создал заявку на отпуск", time: "2 мин назад", avatar: "ИИ" },
    { user: "Петрова Анна", action: "утвердила заявку", time: "15 мин назад", avatar: "ПА" },
    { user: "Сидоров Петр", action: "добавил нового сотрудника", time: "1 час назад", avatar: "СП" },
    { user: "Кузнецова Мария", action: "закрыла вакансию", time: "3 часа назад", avatar: "КМ" },
  ];

  const tabs = [
    { id: "overview", label: "Обзор" },
    { id: "employees", label: "Сотрудники" },
    { id: "vacations", label: "Отпуска" },
    { id: "reports", label: "Отчёты" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
        <p className="text-gray-500 mt-1">Добро пожаловать в HR-систему КЭТ</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Табы */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                selectedTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Контент вкладок */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основной контент */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/employees" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl mb-2">👥</span>
                <span className="text-sm font-medium text-gray-700">Сотрудники</span>
              </Link>
              <Link to="/vacations" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl mb-2">🏖️</span>
                <span className="text-sm font-medium text-gray-700">Отпуска</span>
              </Link>
              <Link to="/vacancies" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl mb-2">📋</span>
                <span className="text-sm font-medium text-gray-700">Вакансии</span>
              </Link>
              <Link to="/reports" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl mb-2">📊</span>
                <span className="text-sm font-medium text-gray-700">Отчёты</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Последние активности */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Последние активности</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium shrink-0">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;