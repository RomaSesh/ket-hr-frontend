import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../api/employees';
import { getDepartments } from '../api/departments';
import { getPositions } from '../api/positions';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import AddEmployeeModal from '../components/AddEmployeeModal';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('Все');
  const [filterStatus, setFilterStatus] = useState('Все');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [positionsList, setPositionsList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Загрузка данных
  const fetchData = async () => {
    setLoading(true);
    try {
      const [employeesData, deptsData, posData] = await Promise.all([
        getEmployees(),
        getDepartments(),
        getPositions()
      ]);
      // employeesData уже приходит в camelCase от бэкенда
      setEmployees(employeesData);
      setDepartmentsList(deptsData);
      setPositionsList(posData);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Фильтрация - используем camelCase поля
  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.lastName || ''} ${emp.firstName || ''} ${emp.middleName || ''}`.toLowerCase();
    const position = positionsList.find(p => p.id === emp.positionId)?.title?.toLowerCase() || '';
    const department = departmentsList.find(d => d.id === emp.departmentId)?.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      fullName.includes(search) ||
      position.includes(search) ||
      department.includes(search) ||
      emp.email?.toLowerCase().includes(search);
    const matchesDept = filterDept === 'Все' ||
      departmentsList.find(d => d.id === emp.departmentId)?.name === filterDept;
    const statusLabel = emp.isActive ? 'active' : 'fired';
    const matchesStatus = filterStatus === 'Все' || statusLabel === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDept, filterStatus]);

  // Удаление
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить сотрудника?')) return;
    try {
      await deleteEmployee(id);
      toast.info('Сотрудник удалён');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Статистика
  const totalActive = employees.filter(e => e.isActive).length;
  const totalFired = employees.filter(e => !e.isActive).length;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
          Ошибка: {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Заголовок и кнопка */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>👥</span> Сотрудники КЭТ
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-xl font-medium shadow-md transition flex items-center gap-2"
          >
            <span>➕</span> Добавить сотрудника
          </button>
        </div>

        {/* Фильтры и поиск */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Поиск по ФИО, должности, email..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option>Все отделения</option>
            {departmentsList.map(dept => (
              <option key={dept.id}>{dept.name}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>Все статусы</option>
            <option value="active">Активен</option>
            <option value="fired">Уволен</option>
          </select>
        </div>

        {/* Статистика */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-6">
          <span className="text-2xl font-bold text-blue-900">{filteredEmployees.length}</span>
          <span className="text-gray-600">сотрудников всего</span>
          <div className="flex gap-2">
            <div className="bg-white rounded-full px-3 py-1 text-sm border border-gray-200">
              Активные: {totalActive}
            </div>
            <div className="bg-white rounded-full px-3 py-1 text-sm border border-gray-200">
              Уволенные: {totalFired}
            </div>
          </div>
        </div>

        {/* Таблица сотрудников */}
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сотрудник</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Должность</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Отдел</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedEmployees.map(emp => {
                const dept = departmentsList.find(d => d.id === emp.departmentId);
                const pos = positionsList.find(p => p.id === emp.positionId);
                const initials = `${emp.lastName?.[0] || ''}${emp.firstName?.[0] || ''}`.toUpperCase();
                return (
                  <tr key={emp.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
                          {initials || '?'}
                        </div>
                        <div>
                          <Link to={`/employees/${emp.id}`} className="font-medium text-gray-900 hover:text-blue-800">
                            {`${emp.lastName || ''} ${emp.firstName || ''} ${emp.middleName || ''}`}
                          </Link>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{pos?.title || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                        {dept?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {emp.isActive ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">Активен</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">Уволен</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link
                          to={`/employees/${emp.id}/edit`}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          title="Редактировать"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Нет сотрудников
                  </td>
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
            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
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
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
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
            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
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

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeAdded={fetchData}
      />
    </Layout>
  );
}

export default Employees;