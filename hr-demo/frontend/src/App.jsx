import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Состояние для списка сотрудников (загружаем из localStorage или берем начальные)
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Иванов Иван', position: 'Разработчик', department: 'IT' },
      { id: 2, name: 'Петрова Анна', position: 'HR-менеджер', department: 'HR' },
      { id: 3, name: 'Сидоров Петр', position: 'Бухгалтер', department: 'Финансы' },
    ];
  });

  // Состояние для фильтра по отделу
  const [filterDept, setFilterDept] = useState('Все');

  // Состояния для формы добавления
  const [newName, setNewName] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newDept, setNewDept] = useState('IT');

  // Сохраняем сотрудников в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  // Получаем уникальные отделы для фильтра
  const departments = ['Все', ...new Set(employees.map(emp => emp.department))];

  // Фильтруем сотрудников
  const filteredEmployees = filterDept === 'Все'
    ? employees
    : employees.filter(emp => emp.department === filterDept);

  // Обработчик добавления нового сотрудника
  const addEmployee = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPosition.trim()) return;
    const newEmployee = {
      id: Date.now(), // простой способ получить уникальный id
      name: newName.trim(),
      position: newPosition.trim(),
      department: newDept,
    };
    setEmployees([...employees, newEmployee]);
    setNewName('');
    setNewPosition('');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1> HR-система управления сотрудниками</h1>
      </header>

      <main>
        {/* Панель фильтрации */}
        <div className="filter-panel">
          <label htmlFor="dept-filter">Фильтр по отделу:</label>
          <select
            id="dept-filter"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Таблица сотрудников */}
        <table className="employee-table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Должность</th>
              <th>Отдел</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="3" className="empty-message">Нет сотрудников</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Форма добавления */}
        <div className="add-form">
          <h3>➕ Добавить нового сотрудника</h3>
          <form onSubmit={addEmployee}>
            <div className="form-group">
              <input
                type="text"
                placeholder="ФИО"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Должность"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <select
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              >
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Финансы">Финансы</option>
                <option value="Маркетинг">Маркетинг</option>
              </select>
            </div>
            <button type="submit" className="btn-submit">Добавить</button>
          </form>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 КЭТ им. Ф.В. Чижова — учебный проект</p>
      </footer>
    </div>
  );
}

export default App;