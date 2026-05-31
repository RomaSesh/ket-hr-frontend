import React, { useState, useEffect } from 'react';
import { createEmployee } from '../api/employees';
import { getDepartments } from '../api/departments';
import { getPositions } from '../api/positions';
import { toast } from 'react-toastify';
import { Button, Input, Select, Modal } from './ui';

const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = 'Введите ФИО';
    if (!form.position_id) newErrors.position_id = 'Выберите должность';
    if (!form.department_id) newErrors.department_id = 'Выберите отдел';
    if (!form.email) newErrors.email = 'Введите email';
    if (!form.hire_date) newErrors.hire_date = 'Укажите дату приёма';
    if (form.email && !form.email.includes('@')) newErrors.email = 'Некорректный email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const nameParts = form.full_name.trim().split(' ');
    const lastName = nameParts[0] || '';
    const firstName = nameParts[1] || '';
    const middleName = nameParts[2] || '';
    const isActive = form.status === 'active';

    setIsSubmitting(true);
    try {
      await createEmployee({
        firstName, lastName, middleName,
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
        personnelNumber: `EMP-${Date.now()}`,
      });
      toast.success('Сотрудник добавлен');
      onEmployeeAdded();
      onClose();
      setForm({
        full_name: '', position_id: '', department_id: '', email: '', phone: '',
        hire_date: '', birth_date: '', status: 'active', education: '', specialty: '', address: ''
      });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка создания сотрудника');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="➕ Добавление сотрудника" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ФИО полностью"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          placeholder="Петров Сергей Николаевич"
          error={errors.full_name}
        />
        <Select
          label="Должность"
          name="position_id"
          value={form.position_id}
          onChange={handleChange}
          options={positions.map(p => ({ value: p.id, label: p.title }))}
          required
          error={errors.position_id}
        />
        <Select
          label="Отделение/Кафедра"
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
          options={departments.map(d => ({ value: d.id, label: d.name }))}
          required
          error={errors.department_id}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            error={errors.email}
          />
          <Input
            label="Телефон"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Дата приёма"
            name="hire_date"
            type="date"
            value={form.hire_date}
            onChange={handleChange}
            required
            error={errors.hire_date}
          />
          <Input
            label="Дата рождения"
            name="birth_date"
            type="date"
            value={form.birth_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input type="radio" name="status" value="active" checked={form.status === 'active'} onChange={handleChange} />
              <span className="ml-2">Активен</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="status" value="vacation" checked={form.status === 'vacation'} onChange={handleChange} />
              <span className="ml-2">В отпуске</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="status" value="inactive" checked={form.status === 'inactive'} onChange={handleChange} />
              <span className="ml-2">Неактивен</span>
            </label>
          </div>
        </div>
        <Input label="Образование" name="education" value={form.education} onChange={handleChange} />
        <Input label="Специальность" name="specialty" value={form.specialty} onChange={handleChange} />
        <Input label="Адрес" name="address" value={form.address} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>Сохранить</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEmployeeModal;