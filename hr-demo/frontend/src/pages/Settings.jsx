import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Layout from '../components/Layout';
import { Input, Button } from '../components/ui';

const Settings = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setPasswordError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setPasswordError('Новый пароль и подтверждение не совпадают');
      toast.error('Пароли не совпадают');
      return;
    }
    if (form.newPassword.length < 6) {
      setPasswordError('Пароль должен содержать не менее 6 символов');
      toast.error('Пароль слишком короткий');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        current_password: form.currentPassword,
        new_password: form.newPassword
      });
      toast.success('Пароль успешно изменён');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Ошибка смены пароля';
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Настройки</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Смена пароля</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Текущий пароль"
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
            <Input
              label="Новый пароль"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              required
              error={passwordError && !form.confirmPassword ? passwordError : ''}
            />
            <Input
              label="Подтвердите новый пароль"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              error={passwordError}
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={loading}>
                Изменить пароль
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Информация о системе</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Версия:</strong> 2.0.0</p>
            <p><strong>Разработчик:</strong> Дружинин Роман, группа 3-2ИС</p>
            <p><strong>Технологии:</strong> React, FastAPI, MySQL, Tailwind CSS</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;