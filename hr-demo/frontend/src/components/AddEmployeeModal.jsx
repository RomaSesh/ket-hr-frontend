import React, { useState, useEffect } from 'react';
import { createEmployee } from '../api/employees';
import { getDepartments } from '../api/departments';
import { getPositions } from '../api/positions';
import { toast } from 'react-toastify';

const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    position_id: '',
    department_id: '',
    email: '',
    phone: '',
    hire_date: '',
    birth_date: '',
    status: 'active',
    education: '',
    specialty: '',
    address: '',
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [depts, pos] = await Promise.all([getDepartments(), getPositions()]);
          setDepartments(depts);
          setPositions(pos);
        } catch (err) {
          toast.error('Ошибка загрузки данных');
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.position_id || !form.department_id || !form.email || !form.hire_date) {
      toast.warning('Заполните все обязательные поля (*)');
      return;
    }

    const nameParts = form.full_name.trim().split(' ');
    const lastName = nameParts[0] || '';
    const firstName = nameParts[1] || '';
    const middleName = nameParts[2] || '';

    const isActive = form.status === 'active';

    try {
      await createEmployee({
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        positionId: parseInt(form.position_id, 10),
        departmentId: parseInt(form.department_id, 10),
        email: form.email,
        phone: form.phone || '',
        hireDate: form.hire_date,
        birthDate: form.birth_date || null,
        isActive: isActive,
        education: form.education,
        specialty: form.specialty,
        address: form.address,
        personnelNumber: `EMP-${Date.now()}`, // добавляем табельный номер
      });
      toast.success('Сотрудник добавлен');
      onEmployeeAdded();
      onClose();
      setForm({
        full_name: '', position_id: '', department_id: '', email: '', phone: '',
        hire_date: '', birth_date: '', status: 'active', education: '', specialty: '', address: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка создания сотрудника');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">➕ Добавление сотрудника КЭТ</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">ФИО полностью <span className="text-red-600">*</span></label>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                placeholder="Петров Сергей Николаевич" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Должность <span className="text-red-600">*</span></label>
              <select name="position_id" value={form.position_id} onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl bg-white" required>
                <option value="">Выберите должность</option>
                {positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Отделение/Кафедра <span className="text-red-600">*</span></label>
              <select name="department_id" value={form.department_id} onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl bg-white" required>
                <option value="">Выберите отдел</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-600">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Телефон</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Дата приема <span className="text-red-600">*</span></label>
                <input type="date" name="hire_date" value={form.hire_date} onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Дата рождения</label>
                <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Статус сотрудника</label>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="status" value="active" checked={form.status === 'active'} onChange={handleChange} className="form-radio text-blue-900" />
                  <span className="ml-2">Активен</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="status" value="vacation" checked={form.status === 'vacation'} onChange={handleChange} className="form-radio text-blue-900" />
                  <span className="ml-2">В отпуске</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="status" value="inactive" checked={form.status === 'inactive'} onChange={handleChange} className="form-radio text-blue-900" />
                  <span className="ml-2">Неактивен</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Образование</label>
              <input type="text" name="education" value={form.education} onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Специальность</label>
              <input type="text" name="specialty" value={form.specialty} onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Адрес</label>
              <input type="text" name="address" value={form.address} onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl" />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800 flex gap-2">
              <span>ℹ️</span>
              <span>Поля, отмеченные <span className="text-red-600">*</span>, обязательны для заполнения.</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100">
                Отмена
              </button>
              <button type="submit" className="px-5 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800">
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;