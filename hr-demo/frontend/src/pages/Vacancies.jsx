import React, { useState, useEffect } from 'react';
import { getVacancies, createVacancy, updateVacancy, closeVacancy, deleteVacancy } from '../api/vacancies';
import { getDepartments } from '../api/departments';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', department_id: '', description: '' });
  const [editing, setEditing] = useState(null);

  // Фильтры и поиск
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Все');
  const [filterDept, setFilterDept] = useState('Все');

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vacData, deptData] = await Promise.all([
        getVacancies(),
        getDepartments()
      ]);
      setVacancies(vacData);
      setDepartments(deptData);
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
      if (editing) {
        await updateVacancy(editing.id, form);
        toast.success('Вакансия обновлена');
      } else {
        await createVacancy(form);
        toast.success('Вакансия создана');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', department_id: '', description: '' });
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm('Закрыть вакансию?')) return;
    try {
      await closeVacancy(id);
      toast.info('Вакансия закрыта');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить вакансию?')) return;
    try {
      await deleteVacancy(id);
      toast.info('Вакансия удалена');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startEdit = (vac) => {
    setEditing(vac);
    setForm({
      title: vac.title,
      department_id: vac.department_id,
      description: vac.description || ''
    });
    setShowForm(true);
  };

  // Фильтрация
  const filteredVacancies = vacancies.filter(vac => {
    const department = departments.find(d => d.id === vac.department_id);
    const deptName = department ? department.name.toLowerCase() : '';
    const matchesSearch = !searchTerm ||
      vac.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deptName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Все' || vac.status === filterStatus;
    const matchesDept = filterDept === 'Все' || vac.department_id === parseInt(filterDept);
    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalPages = Math.ceil(filteredVacancies.length / pageSize);
  const paginatedVacancies = filteredVacancies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterDept]);

  const getStatusBadge = (status) => {
    return status === 'open'
      ? <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Открыта</span>
      : <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Закрыта</span>;
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
          <h1 className="text-2xl font-bold text-gray-800">📋 Вакансии</h1>
          <button
            onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', department_id: '', description: '' }); }}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-colors"
          >
            {showForm ? 'Отмена' : '+ Создать вакансию'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editing ? 'Редактировать вакансию' : 'Новая вакансия'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Название"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Выберите отдел</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Описание"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                {editing ? 'Сохранить' : 'Создать'}
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
                placeholder="Поиск по названию или отделу..."
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
            <option value="open">Открыта</option>
            <option value="closed">Закрыта</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="Все">Все отделы</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Статистика */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center flex-wrap gap-6">
          <span className="text-2xl font-bold text-blue-900">{filteredVacancies.length}</span>
          <span className="text-gray-600">вакансий всего</span>
          <div className="flex gap-2">
            <div className="bg-white rounded-full px-3 py-1 text-sm border border-gray-200">
              Открыто: {filteredVacancies.filter(v => v.status === 'open').length}
            </div>
            <div className="bg-white rounded-full px-3 py-1 text-sm border border-gray-200">
              Закрыто: {filteredVacancies.filter(v => v.status === 'closed').length}
            </div>
          </div>
        </div>

        {/* Таблица вакансий */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Отдел</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedVacancies.map(vac => {
                const dept = departments.find(d => d.id === vac.department_id);
                return (
                  <tr key={vac.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{vac.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{dept ? dept.name : '—'}</td>
                    <td className="px-6 py-4">{getStatusBadge(vac.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(vac)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        {vac.status === 'open' && (
                          <button
                            onClick={() => handleClose(vac.id)}
                            className="text-yellow-600 hover:text-yellow-800 transition-colors"
                            title="Закрыть"
                          >
                            🔒
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(vac.id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedVacancies.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">Нет вакансий</td>
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

export default Vacancies;