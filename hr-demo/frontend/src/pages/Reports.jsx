import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Layout from '../components/Layout';

const Reports = () => {
  const [headcount, setHeadcount] = useState(null);
  const [vacationStats, setVacationStats] = useState([]);
  const [turnover, setTurnover] = useState(null);
  const [loading, setLoading] = useState({ headcount: false, vacation: false, turnover: false });

  const fetchHeadcount = async () => {
    setLoading(prev => ({ ...prev, headcount: true }));
    try {
      const res = await api.get('/reports/headcount');
      setHeadcount(res.data);
    } catch (err) {
      toast.error('Ошибка загрузки отчёта');
    } finally {
      setLoading(prev => ({ ...prev, headcount: false }));
    }
  };

  const fetchVacationStats = async () => {
    setLoading(prev => ({ ...prev, vacation: true }));
    try {
      const res = await api.get('/reports/vacation_stats');
      const data = res.data;
      if (data && data.data && Array.isArray(data.data)) {
        setVacationStats(data.data);
      } else {
        setVacationStats([]);
        console.warn('Некорректный формат статистики отпусков', data);
      }
    } catch (err) {
      toast.error('Ошибка загрузки статистики');
      setVacationStats([]);
    } finally {
      setLoading(prev => ({ ...prev, vacation: false }));
    }
  };

  const fetchTurnover = async () => {
    setLoading(prev => ({ ...prev, turnover: true }));
    try {
      const res = await api.get('/reports/turnover');
      setTurnover(res.data);
    } catch (err) {
      toast.error('Ошибка загрузки текучести');
    } finally {
      setLoading(prev => ({ ...prev, turnover: false }));
    }
  };

  useEffect(() => {
    fetchHeadcount();
    fetchVacationStats();
    fetchTurnover();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Отчёты</h1>

        {/* Численность сотрудников */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Численность сотрудников</h2>
          {loading.headcount ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : headcount ? (
            <>
              <p className="text-2xl font-bold text-blue-900 mb-4">Всего: {headcount.total}</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Отдел</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Количество</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {headcount.by_department && headcount.by_department.map(dept => (
                      <tr key={dept.department} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">{dept.department}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 text-right font-medium">{dept.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">Нет данных</p>
          )}
        </div>

        {/* Текучесть кадров */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Текучесть кадров</h2>
          {loading.turnover ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : turnover ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Всего сотрудников:</span>
                <span className="text-lg font-semibold text-gray-900">{turnover.total_employees}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Уволено:</span>
                <span className="text-lg font-semibold text-red-600">{turnover.fired}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Коэффициент текучести:</span>
                <span className="text-2xl font-bold text-blue-900">{turnover.turnover_rate}%</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Нет данных</p>
          )}
        </div>

        {/* Статистика отпусков */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Статистика отпусков (по месяцам)</h2>
          {loading.vacation ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : vacationStats.length > 0 ? (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Месяц</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Количество заявок</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {vacationStats.map(item => (
                      <tr key={item.month} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">{item.month}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 text-right font-medium">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <BarChart
                  width={Math.min(800, window.innerWidth - 64)}
                  height={320}
                  data={vacationStats}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">Нет данных</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;