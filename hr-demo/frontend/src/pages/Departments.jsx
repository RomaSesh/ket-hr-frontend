import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/departments';
import { getEmployees } from '../api/employees';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', head: '', code: '' });
  const [employeesCount, setEmployeesCount] = useState({});

  // Загрузка отделов и статистики сотрудников
  const fetchData = async () => {
    setLoading(true);
    try {
      const [depts, emps] = await Promise.all([
        getDepartments(),
        getEmployees().catch(() => [])
      ]);
      setDepartments(depts);
      
      // Подсчёт сотрудников по отделам
      const counts = {};
      if (emps && emps.length) {
        emps.forEach(emp => {
          const deptId = emp.departmentId || emp.department_id;
          if (deptId) {
            counts[deptId] = (counts[deptId] || 0) + 1;
          }
        });
      }
      setEmployeesCount(counts);
    } catch (err) {
      toast.error('Ошибка загрузки отделов: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning('Название отделения обязательно');
      return;
    }
    
    const payload = {
      name: form.name,
      description: `Зав. отделением: ${form.head || 'не указан'}; Код: ${form.code || '—'}`,
    };
    
    try {
      if (editing) {
        await updateDepartment(editing.id, payload);
        toast.success('Отдел обновлён');
      } else {
        await createDepartment(payload);
        toast.success('Отдел создан');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', head: '', code: '' });
      fetchData(); // Перезагрузить список
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      toast.error(err.response?.data?.error || err.message || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить отдел? Будут удалены все связанные сотрудники.')) return;
    try {
      await deleteDepartment(id);
      toast.info('Отдел удалён');
      fetchData();
    } catch (err) {
      console.error('Ошибка удаления:', err);
      toast.error(err.response?.data?.error || err.message || 'Ошибка удаления');
    }
  };

  const startEdit = (dept) => {
    // Парсим описание, чтобы показать заведующего и код
    let head = '';
    let code = '';
    if (dept.description) {
      const headMatch = dept.description.match(/Зав\. отделением:\s*(.+?)(;|$)/);
      const codeMatch = dept.description.match(/Код:\s*(.+?)(;|$)/);
      if (headMatch) head = headMatch[1].trim();
      if (codeMatch) code = codeMatch[1].trim();
    }
    setEditing(dept);
    setForm({ 
      name: dept.name || '', 
      head: head, 
      code: code 
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', head: '', code: '' });
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
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <h1 className="text-2xl font-bold text-gray-800">Отделения и кафедры КЭТ</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-xl font-medium shadow-md transition flex items-center gap-2"
          >
            <span>➕</span> Добавить отделение
          </button>
        </div>

        {/* Сетка карточек отделов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map(dept => (
            <div key={dept.id} className="border-2 border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white text-xl">
                    {dept.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{dept.name}</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(dept)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" title="Редактировать">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(dept.id)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" title="Удалить">
                    🗑️
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">👥</span>
                  <span className="font-semibold text-gray-700">{employeesCount[dept.id] || 0}</span>
                  <span className="text-gray-500"> сотрудников</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {dept.description || 'Нет дополнительной информации'}
                </p>
              </div>
            </div>
          ))}
          
          {departments.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500">
              Нет отделов. Нажмите «Добавить отделение», чтобы создать первый отдел.
            </div>
          )}
        </div>

        {/* Форма добавления/редактирования */}
        {showForm && (
          <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editing ? 'Редактирование отделения' : '➕ Добавление нового отделения/кафедры'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Название отделения *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Например: Информационных систем"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Заведующий (ФИО)</label>
                <input
                  type="text"
                  name="head"
                  value={form.head}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="Петрова М.С."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Код отделения</label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="ИС-09"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={cancelForm} className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100">
                  Отмена
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800">
                  {editing ? 'Обновить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Departments;