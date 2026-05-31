import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { Input, Button } from '../components/ui';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', new URLSearchParams(form), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const data = res.data;
      localStorage.setItem('access_token', data.access_token);
      // Получим данные пользователя
      const me = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(me.data));
      toast.success('Добро пожаловать в HR-систему КЭТ!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Неверный логин или пароль';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white text-2xl font-bold">КЭТ</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">Вход в систему</h2>
          <p className="text-gray-500 mt-1">HR-система Костромского энергетического техникума</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center border border-red-200">
              {error}
            </div>
          )}
          <Input
            label="Логин"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            icon="👤"
            placeholder="admin"
          />
          <Input
            label="Пароль"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            icon="🔒"
            placeholder="••••••••"
          />
          <Button type="submit" variant="primary" loading={loading} className="w-full">
            Войти
          </Button>
          <div className="text-center">
            <a href="/register" className="text-sm text-indigo-600 hover:text-indigo-500">Нет аккаунта? Зарегистрироваться</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;