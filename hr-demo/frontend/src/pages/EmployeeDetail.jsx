import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptsRes, posRes, histRes] = await Promise.all([
          api.get(`/employees/${id}`),
          api.get('/departments'),
          api.get('/positions'),
          api.get(`/employees/${id}/history`).catch(() => ({ data: [] }))
        ]);
        setEmployee(empRes.data);
        setDepartments(deptsRes.data);
        setPositions(posRes.data);
        setHistory(histRes.data || []);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить данные сотрудника');
        toast.error('Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить сотрудника?')) return;
    try {
      await api.delete(`/employees/${id}`);
      toast.success('Сотрудник удалён');
      navigate('/employees');
    } catch (err) {
      toast.error('Ошибка удаления');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
          {error || 'Сотрудник не найден'}
        </div>
        <Link to="/employees" className="mt-4 inline-block text-primary hover:underline">
          ← Вернуться к списку сотрудников
        </Link>
      </div>
    );
  }

  const department = departments.find(d => d.id === employee.department_id);
  const position = positions.find(p => p.id === employee.position_id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Кнопка назад */}
      <Link to="/employees" className="inline-flex items-center text-blue-900 hover:text-primary mb-6 transition-colors">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Вернуться к списку сотрудников
      </Link>

      {/* Основная карточка */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Градиентная шапка */}
        <div className="relative bg-gradient-to-r from-blue-900 to-blue-600 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Аватар */}
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-5xl font-bold text-white">
                {employee.last_name?.[0]}{employee.first_name?.[0]}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {employee.last_name} {employee.first_name} {employee.middle_name || ''}
              </h1>
              <p className="text-white/90 text-lg mt-1">
                {position?.title || 'Должность не указана'}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  🟢 {employee.is_active ? 'Активен' : 'Уволен'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/employees/${id}/edit`)}
                className="bg-white text-blue-900 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-gray-100 transition-colors"
              >
                ✏️ Редактировать
              </button>
              <button
                onClick={handleDelete}
                className="bg-white/20 backdrop-blur-sm border border-white/50 text-white px-5 py-2 rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        </div>

        {/* Основное содержимое */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Карточки информации */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-sm text-slate-500 mb-1">ОТДЕЛЕНИЕ / КАФЕДРА</div>
              <div className="text-lg font-bold text-slate-800">{department?.name || '—'}</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-sm text-slate-500 mb-1">ПЕДАГОГИЧЕСКИЙ СТАЖ</div>
              <div className="text-lg font-bold text-slate-800">{employee.experience || '—'}</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-sm text-slate-500 mb-1">ДАТА ПРИЁМА</div>
              <div className="text-lg font-bold text-slate-800">{formatDate(employee.hire_date)}</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-sm text-slate-500 mb-1">ДАТА РОЖДЕНИЯ</div>
              <div className="text-lg font-bold text-slate-800">{formatDate(employee.birth_date) || '—'}</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-sm text-slate-500 mb-1">ОБРАЗОВАНИЕ</div>
              <div className="text-lg font-bold text-slate-800">{employee.education || '—'}</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-sm text-slate-500 mb-1">СПЕЦИАЛЬНОСТЬ</div>
              <div className="text-lg font-bold text-slate-800">{employee.specialty || '—'}</div>
            </div>
          </div>

          {/* Контактная информация */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📞</span>
              <h2 className="text-xl font-semibold text-slate-800">Контактная информация</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-slate-500">Email</div>
                <div className="text-base font-medium text-black">{employee.email || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Телефон</div>
                <div className="text-base font-medium text-black">{employee.phone || '—'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-slate-500">Адрес</div>
                <div className="text-base font-medium text-black">{employee.address || '—'}</div>
              </div>
            </div>
          </div>

          {/* История изменений */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-semibold text-slate-800">История изменений</h2>
            </div>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-200 pb-3 last:border-0">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>{new Date(item.changed_at).toLocaleDateString('ru-RU')}</span>
                      <span>{item.changer ? item.changer.username : 'Система'}</span>
                    </div>
                    <div className="mt-1 text-slate-800">
                      {item.field_name 
                        ? `Изменение ${item.field_name}: ${item.old_value || ''} → ${item.new_value || ''}`
                        : item.new_value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Нет записей</p>
            )}
          </div>

          {/* Нижняя строка с ID, табельным номером, датой обновления */}
          <div className="flex flex-wrap gap-3 justify-between text-xs text-slate-500 border-t border-slate-200 pt-6">
            <div className="bg-slate-100 px-3 py-1 rounded-full">ID: {employee.id}</div>
            <div className="bg-slate-100 px-3 py-1 rounded-full">Табельный номер: {employee.personnel_number || '—'}</div>
            <div className="bg-slate-100 px-3 py-1 rounded-full">
              Последнее обновление: {formatDate(employee.updated_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;