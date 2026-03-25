import React, { useState, useEffect } from 'react';
import { getVacations, createVacation, approveVacation, rejectVacation, deleteVacation } from '../api/vacations';
import { getEmployees } from '../api/employees';
import { toast } from 'react-toastify';

const Vacations = () => {
  const [vacations, setVacations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: '', start_date: '', end_date: '', type: 'annual', comment: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vacData, empData] = await Promise.all([
        getVacations(),
        getEmployees()
      ]);
      setVacations(vacData);
      setEmployees(empData);
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
      await createVacation(form);
      toast.success('Заявка создана');
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveVacation(id);
      toast.success('Заявка утверждена');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectVacation(id);
      toast.success('Заявка отклонена');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить заявку?')) return;
    try {
      await deleteVacation(id);
      toast.info('Заявка удалена');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="loader">Загрузка...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Отпуска</h1>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Создать заявку'}
        </button>
      </div>

      {showForm && (
        <div className="add-form" style={{ marginBottom: '20px' }}>
          <h3>Новая заявка на отпуск</h3>
          <form onSubmit={handleSubmit}>
            <select name="employee_id" onChange={handleChange} required>
              <option value="">Выберите сотрудника</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.last_name} {emp.first_name}
                </option>
              ))}
            </select>
            <input type="date" name="start_date" onChange={handleChange} required />
            <input type="date" name="end_date" onChange={handleChange} required />
            <select name="type" onChange={handleChange}>
              <option value="annual">Ежегодный</option>
              <option value="sick">Больничный</option>
              <option value="unpaid">Без сохранения</option>
            </select>
            <input type="text" name="comment" placeholder="Комментарий" onChange={handleChange} />
            <button type="submit">Отправить</button>
          </form>
        </div>
      )}

      <table className="employee-table">
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Начало</th>
            <th>Конец</th>
            <th>Тип</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {vacations.map(vac => {
            const emp = employees.find(e => e.id === vac.employee_id);
            return (
              <tr key={vac.id}>
                <td>{emp ? `${emp.last_name} ${emp.first_name}` : vac.employee_id}</td>
                <td>{vac.start_date}</td>
                <td>{vac.end_date}</td>
                <td>{vac.type === 'annual' ? 'Ежегодный' : vac.type === 'sick' ? 'Больничный' : 'Без сохранения'}</td>
                <td>
                  {vac.status === 'pending' && <span style={{ color: 'orange' }}>На рассмотрении</span>}
                  {vac.status === 'approved' && <span style={{ color: 'green' }}>Утверждён</span>}
                  {vac.status === 'rejected' && <span style={{ color: 'red' }}>Отклонён</span>}
                </td>
                <td>
                  {vac.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(vac.id)} className="edit-btn" style={{ background: '#28a745' }}>✓</button>
                      <button onClick={() => handleReject(vac.id)} className="delete-btn" style={{ background: '#dc3545' }}>✗</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(vac.id)} className="delete-btn">🗑️</button>
                </td>
              </tr>
            );
          })}
          {vacations.length === 0 && (
            <tr><td colSpan="6" className="empty-message">Нет заявок</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vacations;