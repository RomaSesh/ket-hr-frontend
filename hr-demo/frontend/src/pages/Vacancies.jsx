import React, { useState, useEffect } from 'react';
import { getVacancies, createVacancy, updateVacancy, closeVacancy, deleteVacancy } from '../api/vacancies';
import { getDepartments } from '../api/departments';
import { toast } from 'react-toastify';

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', department_id: '', description: '' });
  const [editing, setEditing] = useState(null);

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

  if (loading) return <div className="loader">Загрузка...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Вакансии</h1>
        <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', department_id: '', description: '' }); }}>
          {showForm ? 'Отмена' : '+ Создать вакансию'}
        </button>
      </div>

      {showForm && (
        <div className="add-form" style={{ marginBottom: '20px' }}>
          <h3>{editing ? 'Редактировать вакансию' : 'Новая вакансия'}</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Название" value={form.title} onChange={handleChange} required />
            <select name="department_id" value={form.department_id} onChange={handleChange} required>
              <option value="">Выберите отдел</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} rows="3" />
            <button type="submit">{editing ? 'Сохранить' : 'Создать'}</button>
          </form>
        </div>
      )}

      <table className="employee-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Отдел</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {vacancies.map(vac => {
            const dept = departments.find(d => d.id === vac.department_id);
            return (
              <tr key={vac.id}>
                <td>{vac.title}</td>
                <td>{dept ? dept.name : vac.department_id}</td>
                <td>{vac.status === 'open' ? 'Открыта' : 'Закрыта'}</td>
                <td>
                  <button onClick={() => startEdit(vac)} className="edit-btn">✏️</button>
                  {vac.status === 'open' && (
                    <button onClick={() => handleClose(vac.id)} className="edit-btn" style={{ background: '#ffc107' }}>🔒</button>
                  )}
                  <button onClick={() => handleDelete(vac.id)} className="delete-btn">🗑️</button>
                </td>
              </tr>
            );
          })}
          {vacancies.length === 0 && (
            <tr><td colSpan="4" className="empty-message">Нет вакансий</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vacancies;