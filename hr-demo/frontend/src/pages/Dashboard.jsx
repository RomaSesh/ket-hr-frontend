import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeVacations: 0,
    openVacancies: 0,
    pendingVacations: 0,
  });
  const [recentVacations, setRecentVacations] = useState([]);
  const [recentVacancies, setRecentVacancies] = useState([]);
  const [headcountData, setHeadcountData] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [employeesRes, vacationsRes, vacanciesRes, headcountRes, userRes] = await Promise.all([
          api.get('/employees'),
          api.get('/vacations'),
          api.get('/vacancies'),
          api.get('/reports/headcount'),
          api.get('/auth/me').catch(() => null)
        ]);

        const employees = employeesRes.data;
        const vacations = vacationsRes.data;
        const vacancies = vacanciesRes.data;
        const headcount = headcountRes.data;

        setStats({
          totalEmployees: employees.length,
          activeVacations: vacations.filter(v => v.status === 'approved').length,
          openVacancies: vacancies.filter(v => v.status === 'open').length,
          pendingVacations: vacations.filter(v => v.status === 'pending').length,
        });

        const sortedVacations = [...vacations].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentVacations(sortedVacations.slice(0, 5));

        const sortedVacancies = [...vacancies].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentVacancies(sortedVacancies.slice(0, 5));

        if (headcount && headcount.by_department) {
          setHeadcountData(headcount.by_department);
        }

        if (userRes && userRes.data) {
          setUserName(userRes.data.username || userRes.data.full_name || 'Пользователь');
        } else {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const userObj = JSON.parse(storedUser);
              setUserName(userObj.full_name || userObj.username || 'Пользователь');
            } catch (e) {
              setUserName('Пользователь');
            }
          } else {
            setUserName('Пользователь');
          }
        }

      } catch (error) {
        console.error('Ошибка загрузки дашборда:', error);
        toast.error('Не удалось загрузить данные дашборда');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Добро пожаловать, {userName}!</h1>
          <p className="text-gray-500 mt-1">Вот краткая сводка по вашей HR-системе</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">👥</span>
              <span className="text-xs font-medium text-gray-500">Всего</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalEmployees}</div>
            <div className="text-sm text-gray-500">Сотрудников</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🏖️</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Активные</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeVacations}</div>
            <div className="text-sm text-gray-500">Сотрудников в отпуске</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">📋</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Открыто</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.openVacancies}</div>
            <div className="text-sm text-gray-500">Вакансий</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">⏳</span>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">В обработке</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingVacations}</div>
            <div className="text-sm text-gray-500">Заявок на отпуск</div>
          </div>
        </div>

        {headcountData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Численность сотрудников по отделам</h2>
            <BarChart
              width={Math.min(800, window.innerWidth - 64)}
              height={320}
              data={headcountData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0066B3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Последние заявки на отпуск</h2>
              <Link to="/vacations" className="text-sm text-primary hover:underline">Все заявки →</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentVacations.length > 0 ? (
                recentVacations.map(vac => (
                  <div key={vac.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Заявка #{vac.id}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(vac.start_date).toLocaleDateString()} – {new Date(vac.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      {vac.status === 'pending' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">На рассмотрении</span>
                      )}
                      {vac.status === 'approved' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Утверждён</span>
                      )}
                      {vac.status === 'rejected' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Отклонён</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">Нет заявок на отпуск</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Последние вакансии</h2>
              <Link to="/vacancies" className="text-sm text-primary hover:underline">Все вакансии →</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentVacancies.length > 0 ? (
                recentVacancies.map(vac => (
                  <div key={vac.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vac.title}</p>
                      <p className="text-xs text-gray-500">
                        {vac.department ? vac.department.name : 'Без отдела'}
                      </p>
                    </div>
                    <div>
                      {vac.status === 'open' ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Открыта</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Закрыта</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">Нет вакансий</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;