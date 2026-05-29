import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
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
        toast.error('Не удалось загрузить данные сотрудника');
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
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!employee) {
    return <div className="p-8 text-center text-red-600">Сотрудник не найден</div>;
  }

  const department = departments.find(d => d.id === employee.departmentId);
  const position = positions.find(p => p.id === employee.positionId);
  const initials = `${employee.lastName?.[0] || ''}${employee.firstName?.[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/employees" className="inline-flex items-center text-blue-800 hover:text-blue-600 mb-6">
        ← Вернуться к списку сотрудников
      </Link>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white flex items-center justify-center text-5xl font-bold shadow-lg">
              {initials || '👤'}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">
                {employee.lastName || ''} {employee.firstName || ''} {employee.middleName || ''}
              </h1>
              <p className="text-white/90 text-lg mt-1">{position?.title || 'Должность не указана'}</p>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm">
                  {employee.isActive ? '🟢 Активен' : '🔴 Уволен'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/employees/${id}/edit`)}
                className="bg-white text-blue-900 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-gray-100 transition"
              >
                ✏️ Редактировать
              </button>
              <button
                onClick={handleDelete}
                className="bg-white/20 backdrop-blur-sm border border-white/50 text-white px-5 py-2 rounded-xl font-semibold hover:bg-white/30"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Отделение / Кафедра" value={department?.name || '—'} />
            <InfoCard label="Педагогический стаж" value={employee.experience || '—'} />
            <InfoCard label="Дата приёма" value={formatDate(employee.hireDate)} />
            <InfoCard label="Дата рождения" value={formatDate(employee.birthDate)} />
            <InfoCard label="Образование" value={employee.education || '—'} />
            <InfoCard label="Специальность" value={employee.specialty || '—'} />
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📞</span> Контактная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{employee.email || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Телефон</p>
                <p className="font-medium text-gray-900">{employee.phone || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Адрес</p>
                <p className="font-medium text-gray-900">{employee.address || '—'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span> История изменений
            </h2>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatDate(item.changedAt)}</span>
                      <span>{item.changer || 'Система'}</span>
                    </div>
                    <p className="mt-1 text-gray-800">
                      {item.fieldName
                        ? `Изменение ${item.fieldName}: ${item.oldValue || '—'} → ${item.newValue || '—'}`
                        : item.newValue}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">Нет записей</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="bg-gray-100 px-3 py-1 rounded-full">ID: {employee.id}</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">Табельный номер: {employee.personnelNumber || '—'}</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">Последнее обновление: {formatDate(employee.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-lg font-bold text-gray-800 mt-1">{value || '—'}</p>
  </div>
);

export default EmployeeDetail;