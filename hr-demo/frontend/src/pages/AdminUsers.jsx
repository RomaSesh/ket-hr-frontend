// src/pages/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'employee',
    employee_id: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Ошибка загрузки пользователей', err);
      toast.error('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Ошибка загрузки сотрудников', err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('Роль обновлена');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка обновления роли');
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const res = await api.post(`/admin/users/${userId}/reset-password`);
      toast.info(`Временный пароль: ${res.data.temporary_password}`, { autoClose: 10000 });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка сброса пароля');
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      await api.put(`/admin/users/${userId}/block`, { blocked: !isBlocked });
      toast.success(isBlocked ? 'Пользователь разблокирован' : 'Пользователь заблокирован');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка изменения статуса');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error('Заполните логин, email и пароль');
      return;
    }
    try {
      await api.post('/admin/users', newUser);
      toast.success('Пользователь создан');
      setShowCreateModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'employee', employee_id: '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка создания пользователя');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">👥 Управление пользователями</h1>
          <Button onClick={() => setShowCreateModal(true)}>➕ Создать пользователя</Button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Логин</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сотрудник</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.last_name && user.first_name ? `${user.last_name} ${user.first_name}` : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="admin">Админ</option>
                      <option value="hr">HR</option>
                      <option value="manager">Руководитель</option>
                      <option value="employee">Сотрудник</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_blocked ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Заблокирован
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Активен
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleResetPassword(user.id)}>
                      Сброс пароля
                    </Button>
                    <Button
                      size="sm"
                      variant={user.is_blocked ? 'primary' : 'danger'}
                      onClick={() => handleBlockToggle(user.id, user.is_blocked)}
                    >
                      {user.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Пользователи не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Модальное окно создания пользователя */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Создание пользователя">
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Логин *</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль *</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white"
              >
                <option value="employee">Сотрудник</option>
                <option value="hr">HR</option>
                <option value="manager">Руководитель</option>
                <option value="admin">Админ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Привязать к сотруднику (необязательно)</label>
              <select
                value={newUser.employee_id}
                onChange={(e) => setNewUser({ ...newUser, employee_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white"
              >
                <option value="">-- Не привязывать --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.last_name} {emp.first_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Отмена</Button>
              <Button type="submit" variant="primary">Создать</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default AdminUsers;