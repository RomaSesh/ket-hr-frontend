import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/employees';
import { getDepartments } from '../api/departments';
import { getPositions } from '../api/positions';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('Все');
  const [filterStatus, setFilterStatus] = useState('Все'); // 'Все', 'active', 'fired'

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [departmentsList, setDepartmentsList] = useState([]);
  const [positionsList, setPositionsList] = useState([]);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editDept, setEditDept] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPositionId, setNewPositionId] = useState('');
  const [newDept, setNewDept] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employeesData, deptsData, posData] = await Promise.all([
          getEmployees(),
          getDepartments(),
          getPositions()
        ]);
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
    fetchData();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.last_name} ${emp.first_name} ${emp.middle_name || ''}`.toLowerCase();
    const position = positionsList.find(p => p.id === emp.position_id)?.title?.toLowerCase() || '';
    const department = departmentsList.find(d => d.id === emp.department_id)?.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      fullName.includes(search) ||
      position.includes(search) ||
      department.includes(search) ||
      emp.email?.toLowerCase().includes(search);

    const matchesDept = filterDept === 'Все' ||
      departmentsList.find(d => d.id === emp.department_id)?.name === filterDept;

    const statusLabel = emp.is_active ? 'active' : 'fired';
    const matchesStatus = filterStatus === 'Все' || statusLabel === filterStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDept, filterStatus]);

  const addEmployee = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPositionId || !newDept) {
      toast.warning('Заполните все поля');
      return;
    }

    const parts = newName.trim().split(' ');
    const lastName = parts[0] || '';
    const firstName = parts[1] || '';
    const middleName = parts[2] || '';

    const selectedDept = departmentsList.find(d => d.name === newDept);
    if (!selectedDept) {
      toast.error('Отдел не найден');
      return;
    }

    try {
      const newEmployee = await createEmployee({
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        position_id: parseInt(newPositionId, 10),
        department_id: selectedDept.id,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.ru`,
        phone: '',
        hire_date: new Date().toISOString().split('T')[0],
        is_active: true
      });
      setEmployees([...employees, newEmployee]);
      setNewName('');
      setNewPositionId('');
      setNewDept('');
      setShowAddModal(false);
      toast.success('Сотрудник добавлен');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить сотрудника?')) return;
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
      toast.info('Сотрудник удалён');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startEdit = (emp) => {
    setEditingEmployee(emp);
    setEditName(`${emp.last_name} ${emp.first_name} ${emp.middle_name || ''}`.trim());
    setEditPosition(emp.position_id);
    const dept = departmentsList.find(d => d.id === emp.department_id);
    setEditDept(dept ? dept.name : '');
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editPosition || !editDept) {
      toast.warning('Заполните все поля');
      return;
    }

    const parts = editName.trim().split(' ');
    const lastName = parts[0] || '';
    const firstName = parts[1] || '';
    const middleName = parts[2] || '';

    const selectedDept = departmentsList.find(d => d.name === editDept);
    if (!selectedDept) {
      toast.error('Отдел не найден');
      return;
    }

    try {
      const updated = await updateEmployee(editingEmployee.id, {
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        position_id: parseInt(editPosition, 10),
        department_id: selectedDept.id,
        email: editingEmployee.email,
        phone: editingEmployee.phone,
        hire_date: editingEmployee.hire_date,
        is_active: editingEmployee.is_active
      });
      setEmployees(employees.map(emp => emp.id === updated.id ? updated : emp));
      setEditingEmployee(null);
      toast.success('Данные обновлены');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
  };

  const totalActive = employees.filter(e => e.is_active).length;
  const totalFired = employees.filter(e => !e.is_active).length;

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">Активен</span>;
    }
    return <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">Уволен</span>;
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

  if (error) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 text-red-700 rounded-lg text-center">
          Ошибка: {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">👥 Сотрудники КЭТ</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-colors"
          >
            <span>➕</span> Добавить сотрудника
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Поиск по ФИО, должности, email..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="Все">Все отделения</option>
            {departmentsList.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Все">Все статусы</option>
            <option value="active">Активен</option>
            <option value="fired">Уволен</option>
          </select>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center flex-wrap gap-6">
          <span className="text-2xl font-bold text-blue-900">{filteredEmployees.length}</span>
          <span className="text-gray-600">сотрудников всего</span>
          <div className="flex gap-2">
            <div className="bg-white rounded-full px-3 py-1 text-sm border border-gray-200">Активные: {totalActive} ✕</div>
            <div className="bg-white rounded-full px-3 py-1 text-sm border border-gray-200">Уволенные: {totalFired} ✕</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">СОТРУДНИК</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ДОЛЖНОСТЬ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ОТДЕЛЕНИЕ/КАФЕДРА</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">СТАТУС</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedEmployees.map(emp => {
                const dept = departmentsList.find(d => d.id === emp.department_id);
                const pos = positionsList.find(p => p.id === emp.position_id);
                const initials = `${emp.last_name?.[0]}${emp.first_name?.[0]}`.toUpperCase();
                return (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                          {initials}
                        </div>
                        <div>
                          <Link to={`/employees/${emp.id}`} className="font-medium text-gray-900 hover:text-blue-900">
                            {`${emp.last_name} ${emp.first_name} ${emp.middle_name || ''}`}
                          </Link>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{pos?.title || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm">
                        {dept?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(emp.is_active)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(emp)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">✏️</button>
                        <button onClick={() => handleDelete(emp.id)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Нет сотрудников</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

      {/* Модалка добавления */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Добавить сотрудника</h3>
            <form onSubmit={addEmployee}>
              <input
                type="text"
                placeholder="ФИО (Фамилия Имя Отчество)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
                required
              />
              <select
                value={newPositionId}
                onChange={(e) => setNewPositionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
                required
              >
                <option value="">Выберите должность</option>
                {positionsList.map(pos => (
                  <option key={pos.id} value={pos.id}>{pos.title}</option>
                ))}
              </select>
              <select
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
                required
              >
                <option value="">Выберите отдел</option>
                {departmentsList.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors">
                  Сохранить
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модалка редактирования */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={cancelEdit}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Редактировать сотрудника</h3>
            <form onSubmit={saveEdit}>
              <input
                type="text"
                placeholder="ФИО (Фамилия Имя Отчество)"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
                required
              />
              <select
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
                required
              >
                <option value="">Выберите должность</option>
                {positionsList.map(pos => (
                  <option key={pos.id} value={pos.id}>{pos.title}</option>
                ))}
              </select>
              <select
                value={editDept}
                onChange={(e) => setEditDept(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
                required
              >
                <option value="">Выберите отдел</option>
                {departmentsList.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors">
                  Сохранить
                </button>
                <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Employees;