import React, { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/employees';
import { getDepartments } from '../api/departments';
import { getPositions } from '../api/positions';
import { toast } from 'react-toastify';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterDept, setFilterDept] = useState('Все');

  const [newName, setNewName] = useState('');
  const [newPositionId, setNewPositionId] = useState('');
  const [newDept, setNewDept] = useState('');

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editDept, setEditDept] = useState('');

  const [departmentsList, setDepartmentsList] = useState([]);
  const [positionsList, setPositionsList] = useState([]);

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

  const departmentsForFilter = ['Все', ...departmentsList.map(d => d.name)];

  const filteredEmployees = filterDept === 'Все'
    ? employees
    : employees.filter(emp => {
        const dept = departmentsList.find(d => d.id === emp.department_id);
        return dept && dept.name === filterDept;
      });

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
      cancelEdit();
      toast.success('Данные обновлены');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
    setEditName('');
    setEditPosition('');
    setEditDept('');
  };

  if (loading) return <div className="loader">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="container">
      <div className="filter-panel">
        <label>Фильтр по отделу:</label>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          {departmentsForFilter.map(dept => <option key={dept}>{dept}</option>)}
        </select>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Отдел</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => {
            const dept = departmentsList.find(d => d.id === emp.department_id);
            const pos = positionsList.find(p => p.id === emp.position_id);
            return (
              <tr key={emp.id}>
                <td>{`${emp.last_name} ${emp.first_name} ${emp.middle_name || ''}`}</td>
                <td>{pos ? pos.title : emp.position_id}</td>
                <td>{dept ? dept.name : emp.department_id}</td>
                <td>
                  <button onClick={() => startEdit(emp)} className="edit-btn">✏️ Редактировать</button>
                  <button onClick={() => handleDelete(emp.id)} className="delete-btn">🗑️ Удалить</button>
                </td>
              </tr>
            );
          })}
          {filteredEmployees.length === 0 && (
            <tr><td colSpan="4" className="empty-message">Нет сотрудников</td></tr>
          )}
        </tbody>
      </table>

      <div className="add-form">
        <h3>➕ Добавить нового сотрудника</h3>
        <form onSubmit={addEmployee}>
          <input
            type="text"
            placeholder="ФИО (Фамилия Имя Отчество)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <select
            value={newPositionId}
            onChange={(e) => setNewPositionId(e.target.value)}
            required
          >
            <option value="">Выберите должность</option>
            {positionsList.map(pos => (
              <option key={pos.id} value={pos.id}>{pos.title}</option>
            ))}
          </select>
          <select value={newDept} onChange={(e) => setNewDept(e.target.value)} required>
            <option value="">Выберите отдел</option>
            {departmentsList.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          <button type="submit">Добавить</button>
        </form>
      </div>

      {editingEmployee && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Редактировать сотрудника</h3>
            <form onSubmit={saveEdit}>
              <input
                type="text"
                placeholder="ФИО (Фамилия Имя Отчество)"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              <select
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
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
                required
              >
                <option value="">Выберите отдел</option>
                {departmentsList.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <div className="modal-buttons">
                <button type="submit">Сохранить</button>
                <button type="button" onClick={cancelEdit}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;