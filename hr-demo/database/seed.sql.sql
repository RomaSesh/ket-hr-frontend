-- =====================================================
-- Тестовые данные для HR-системы
-- =====================================================

-- Отделы
INSERT INTO departments (name, description) VALUES
    ('IT', 'Информационные технологии и разработка'),
    ('HR', 'Отдел кадров и управления персоналом'),
    ('Финансы', 'Финансовый департамент, бухгалтерия')
ON CONFLICT (name) DO NOTHING;

-- Должности
INSERT INTO positions (title, salary_min, salary_max, department_id) VALUES
    ('Разработчик', 80000, 150000, (SELECT id FROM departments WHERE name = 'IT')),
    ('HR-менеджер', 50000, 80000, (SELECT id FROM departments WHERE name = 'HR')),
    ('Бухгалтер', 60000, 100000, (SELECT id FROM departments WHERE name = 'Финансы'))
ON CONFLICT DO NOTHING;

-- Сотрудники
INSERT INTO employees (first_name, last_name, middle_name, position_id, department_id, email, phone, hire_date, is_active) VALUES
    ('Иван', 'Иванов', 'Иванович',
     (SELECT id FROM positions WHERE title = 'Разработчик'),
     (SELECT id FROM departments WHERE name = 'IT'),
     'ivan.ivanov@company.ru', '+7 (999) 111-22-33', '2020-01-15', TRUE),
    ('Анна', 'Петрова', 'Сергеевна',
     (SELECT id FROM positions WHERE title = 'HR-менеджер'),
     (SELECT id FROM departments WHERE name = 'HR'),
     'anna.petrova@company.ru', '+7 (999) 222-33-44', '2019-05-20', TRUE),
    ('Петр', 'Сидоров', 'Петрович',
     (SELECT id FROM positions WHERE title = 'Бухгалтер'),
     (SELECT id FROM departments WHERE name = 'Финансы'),
     'petr.sidorov@company.ru', '+7 (999) 333-44-55', '2021-08-10', FALSE),
    ('Мария', 'Смирнова', NULL,
     (SELECT id FROM positions WHERE title = 'HR-менеджер'),
     (SELECT id FROM departments WHERE name = 'HR'),
     'maria.smirnova@company.ru', '+7 (999) 444-55-66', '2022-03-01', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Пользователи (пароли хешируются; здесь для примера)
INSERT INTO users (username, password_hash, email, role, employee_id) VALUES
    ('ivanov_i', 'hash_123', 'ivan.ivanov@company.ru', 'employee', (SELECT id FROM employees WHERE email = 'ivan.ivanov@company.ru')),
    ('petrova_a', 'hash_456', 'anna.petrova@company.ru', 'hr', (SELECT id FROM employees WHERE email = 'anna.petrova@company.ru')),
    ('smirnova_m', 'hash_789', 'maria.smirnova@company.ru', 'hr', (SELECT id FROM employees WHERE email = 'maria.smirnova@company.ru'))
ON CONFLICT (username) DO NOTHING;

-- Несколько записей в истории (пример)
INSERT INTO employee_history (employee_id, action, field_name, old_value, new_value, changed_by) VALUES
    ((SELECT id FROM employees WHERE email = 'petr.sidorov@company.ru'), 'UPDATE', 'is_active', 'true', 'false', 
     (SELECT id FROM users WHERE username = 'petrova_a'));