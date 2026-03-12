import React, { useState } from 'react';
import './App.css';

function App() {
  // Исходные данные сотрудников
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Иванов Иван', position: 'Разработчик', department: 'IT' },
    { id: 2, name: 'Петрова Анна', position: 'HR-менеджер', department: 'HR' },
    { id: 3, name: 'Сидоров Петр', position: 'Бухгалтер', department: 'Финансы' },
  ]);

  // Состояние для формы добавления
  const [newName, setNewName] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newDepartment, setNewDepartment] = useState('IT');

  // Состояние для фильтра
  const [filterDept, setFilterDept] = useState('Все');

  // Добавление сотрудника
  const addEmployee = (e) => {
    e.preventDefault();
    if (!newName || !newPosition) return;
    const newEmployee = {
      id: Date.now(),
      name: newName,
      position: newPosition,
      department: newDepartment,
    };
    setEmployees([...employees, newEmployee]);
    setNewName('');
    setNewPosition('');
  };

  // Фильтрация списка
  const filteredEmployees = filterDept === 'Все'
    ? employees
    : employees.filter(emp => emp.department === filterDept);

  // Уникальные отделы для фильтра
  const departments = ['Все', ...new Set(employees.map(emp => emp.department))];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>HR-система (учебный проект)</h1>

      {/* Фильтр по отделам */}
      <div style={{ marginBottom: '20px' }}>
        <label>Фильтр по отделу: </label>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Таблица сотрудников */}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Отдел</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Форма добавления нового сотрудника */}
      <h3>Добавить сотрудника</h3>
      <form onSubmit={addEmployee}>
        <input
          type="text"
          placeholder="ФИО"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Должность"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          required
          style={{ marginLeft: '10px' }}
        />
        <select
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Финансы">Финансы</option>
        </select>
        <button type="submit" style={{ marginLeft: '10px' }}>Добавить</button>
      </form>
    </div>
  );
}

export default App;