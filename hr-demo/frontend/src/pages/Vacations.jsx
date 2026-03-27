import React, { useState, useEffect } from 'react';
import { getVacations, createVacation, approveVacation, rejectVacation, deleteVacation } from '../api/vacations';
import { getEmployees } from '../api/employees';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const Vacations = () => {
  const [vacations, setVacations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: '', start_date: '', end_date: '', type: 'annual', comment: '' });

  // Фильтры и поиск
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Все');
  const [filterEmployee, setFilterEmployee] = useState('Все');

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vacData, empData] = await Promise.all([
        getVacations(),
        getEmployees()
      ]);
      setVacations(vacData);
      setEmployees(empData);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVacation(form);
      toast.success('Заявка создана');
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveVacation(id);
      toast.success('Заявка утверждена');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectVacation(id);
      toast.success('Заявка отклонена');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить заявку?')) return;
    try {
      await deleteVacation(id);
      toast.info('Заявка удалена');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Фильтрация
  const filteredVacations = vacations.filter(vac => {
    const employee = employees.find(e => e.id === vac.employee_id);
    const employeeName = employee ? `${employee.last_name} ${employee.first_name}`.toLowerCase() : '';
    const matchesSearch = !searchTerm || employeeName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Все' || vac.status === filterStatus;
    const matchesEmployee = filterEmployee === 'Все' || vac.employee_id === parseInt(filterEmployee);
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  const totalPages = Math.ceil(filteredVacations.length / pageSize);
  const paginatedVacations = filteredVacations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterEmployee]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">На рассмотрении</span>;
      case 'approved': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Утверждён</span>;
      case 'rejected': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Отклонён</span>;
      default: return <span>{status}</span>;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'annual': return 'Ежегодный';
      case 'sick': return 'Больничный';
      case 'unpaid': return 'Без сохранения';
      default: return type;
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🏖️ Отпуска</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-colors"
          >
            {showForm ? 'Отмена' : '+ Создать заявку'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Новая заявка на отпуск</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                name="employee_id"
                onChange={handleChange}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Выберите сотрудника</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.last_name} {emp.first_name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="start_date"
                onChange={handleChange}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="date"
                name="end_date"
                onChange={handleChange}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <select
                name="type"
                onChange={handleChange}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="annual">Ежегодный</option>
                <option value="sick">Больничный</option>
                <option value="unpaid">Без сохранения</option>
              </select>
              <button
                type="submit"
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Отправить
              </button>
            </form>
          </div>
        )}

        {/* Фильтры и поиск */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Поиск по сотруднику..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Все">Все статусы</option>
            <option value="pending">На рассмотрении</option>
            <option value="approved">Утверждён</option>
            <option value="rejected">Отклонён</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
          >
            <option value="Все">Все сотрудники</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.last_name} {emp.first_name}</option>
            ))}
          </select>
        </div>

        {/* Статистика */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center flex-wrap gap-6">
          <span className="text-2xl font-bold text-blue-900">{filteredVacations.length}</span>
          <span className="text-gray-600">заявок всего</span>
          <div className="flex gap-2">
            <div className="bg-white rounded-full px-3 py-1 text-sm border border-gray-200">
              В обработке: {filteredVacations.filter(v => v.status === 'pending').length}
            </div>
            <div className="bg-white rounded-full px-3 py-1 text-sm border border-gray-200">
              Утверждено: {filteredVacations.filter(v => v.status === 'approved').length}
            </div>
          </div>
        </div>

        {/* Таблица заявок */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сотрудник</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Начало</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Конец</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedVacations.map(vac => {
                const emp = employees.find(e => e.id === vac.employee_id);
                return (
                  <tr key={vac.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp ? `${emp.last_name} ${emp.first_name}` : vac.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vac.start_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vac.end_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTypeLabel(vac.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(vac.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vac.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(vac.id)}
                            className="px-2 py-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Утвердить"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleReject(vac.id)}
                            className="px-2 py-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Отклонить"
                          >
                            ✗
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => handleDelete(vac.id)}
                        className="px-2 py-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedVacations.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Нет заявок</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        <div className="flex justify-end items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg disabled:opacity-50"
          >
            ◀
          </button>
          {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
            let pageNum = currentPage;
            if (totalPages <= 5) {
              pageNum = idx + 1;
            } else if (currentPage <= 3) {
              pageNum = idx + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + idx;
            } else {
              pageNum = currentPage - 2 + idx;
            }
            if (pageNum > totalPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                  currentPage === pageNum
                    ? 'bg-blue-900 text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg disabled:opacity-50"
          >
            ▶
          </button>
          <select
            className="ml-4 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 на странице</option>
            <option value={20}>20 на странице</option>
            <option value={50}>50 на странице</option>
          </select>
        </div>
      </div>
    </Layout>
  );
};

export default Vacations;