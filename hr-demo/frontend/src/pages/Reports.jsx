import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

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
    <div className="container">
      <h1>Отчёты</h1>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Численность сотрудников</h3>
        {loading.headcount ? <p>Загрузка...</p> : headcount && (
          <>
            <p><strong>Всего сотрудников:</strong> {headcount.total}</p>
            <table className="employee-table" style={{ marginTop: '10px' }}>
              <thead>
                <tr><th>Отдел</th><th>Количество</th></tr>
              </thead>
              <tbody>
                {headcount.by_department && headcount.by_department.map(dept => (
                  <tr key={dept.department}><td>{dept.department}</td><td>{dept.count}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Статистика отпусков (по месяцам)</h3>
        {loading.vacation ? <p>Загрузка...</p> : (
          <table className="employee-table">
            <thead>
              <tr><th>Месяц</th><th>Количество заявок</th></tr>
            </thead>
            <tbody>
              {vacationStats.map(item => (
                <tr key={item.month}><td>{item.month}</td><td>{item.count}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>Текучесть кадров</h3>
        {loading.turnover ? <p>Загрузка...</p> : turnover && (
          <>
            <p><strong>Всего сотрудников:</strong> {turnover.total_employees}</p>
            <p><strong>Уволено:</strong> {turnover.fired}</p>
            <p><strong>Коэффициент текучести:</strong> {turnover.turnover_rate}%</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;