# Структура базы данных HR-системы

База данных спроектирована для PostgreSQL. Все скрипты находятся в этой папке.

## Таблицы

### `departments`
Хранит информацию об отделах организации.

| Поле         | Тип            | Описание                     |
|--------------|----------------|------------------------------|
| id           | SERIAL (PK)    | Уникальный идентификатор     |
| name         | VARCHAR(100)   | Название отдела (уникальное) |
| description  | TEXT           | Описание отдела              |
| created_at   | TIMESTAMP      | Дата создания                |
| updated_at   | TIMESTAMP      | Дата последнего изменения    |

### `positions`
Должности, привязанные к отделам.

| Поле          | Тип                | Описание                         |
|---------------|--------------------|----------------------------------|
| id            | SERIAL (PK)        | Уникальный идентификатор         |
| title         | VARCHAR(150)       | Наименование должности           |
| salary_min    | NUMERIC(10,2)      | Минимальный оклад                |
| salary_max    | NUMERIC(10,2)      | Максимальный оклад               |
| department_id | INTEGER (FK)       | Ссылка на `departments.id`       |
| created_at    | TIMESTAMP          | Дата создания                    |

### `employees`
Основные данные о сотрудниках.

| Поле          | Тип                | Описание                              |
|---------------|--------------------|---------------------------------------|
| id            | SERIAL (PK)        | Уникальный идентификатор              |
| first_name    | VARCHAR(50)        | Имя                                   |
| last_name     | VARCHAR(50)        | Фамилия                               |
| middle_name   | VARCHAR(50)        | Отчество (может быть NULL)            |
| position_id   | INTEGER (FK)       | Ссылка на `positions.id`              |
| department_id | INTEGER (FK)       | Ссылка на `departments.id`            |
| email         | VARCHAR(100)       | Рабочая почта (уникальная)            |
| phone         | VARCHAR(20)        | Номер телефона                        |
| hire_date     | DATE               | Дата приёма на работу                 |
| is_active     | BOOLEAN            | Активен (true) / уволен (false)       |
| created_at    | TIMESTAMP          | Дата создания записи                  |
| updated_at    | TIMESTAMP          | Дата последнего обновления            |

### `users`
Учётные записи для входа в систему.

| Поле          | Тип                | Описание                              |
|---------------|--------------------|---------------------------------------|
| id            | SERIAL (PK)        | Уникальный идентификатор              |
| username      | VARCHAR(50)        | Логин (уникальный)                    |
| password_hash | VARCHAR(255)       | Хеш пароля                            |
| email         | VARCHAR(100)       | Электронная почта (уникальная)        |
| role          | VARCHAR(20)        | Роль (hr, manager, admin, employee)   |
| employee_id   | INTEGER (FK)       | Ссылка на `employees.id` (если есть)  |
| last_login    | TIMESTAMP          | Дата последнего входа                 |
| created_at    | TIMESTAMP          | Дата создания записи                  |

### `employee_history`
Журнал изменений данных сотрудников.

| Поле          | Тип                | Описание                              |
|---------------|--------------------|---------------------------------------|
| id            | SERIAL (PK)        | Уникальный идентификатор              |
| employee_id   | INTEGER (FK)       | Ссылка на `employees.id`              |
| action        | VARCHAR(50)        | Тип действия (CREATE, UPDATE, DELETE) |
| field_name    | VARCHAR(50)        | Название изменённого поля             |
| old_value     | TEXT               | Старое значение                       |
| new_value     | TEXT               | Новое значение                        |
| changed_by    | INTEGER (FK)       | Ссылка на `users.id` (кто изменил)    |
| changed_at    | TIMESTAMP          | Дата и время изменения                |

## Связи между таблицами

- `employees.position_id` → `positions.id` (многие к одному)
- `employees.department_id` → `departments.id` (многие к одному)
- `positions.department_id` → `departments.id` (многие к одному)
- `users.employee_id` → `employees.id` (один к одному, необязательно)
- `employee_history.employee_id` → `employees.id` (многие к одному)
- `employee_history.changed_by` → `users.id` (многие к одному)

## Индексы

Для ускорения поиска созданы индексы на часто используемые поля:
- `idx_employees_email` – поиск по email
- `idx_employees_department_id` – фильтрация по отделу
- `idx_employees_position_id` – фильтрация по должности
- `idx_employees_is_active` – фильтрация по статусу
- `idx_users_username` – поиск пользователя по логину
- `idx_employee_history_employee_id` – быстрый доступ к истории по сотруднику

## Триггеры

Триггеры автоматически обновляют поле `updated_at` в таблицах `employees` и `departments` при изменении записей.

## Использование

1. Создайте базу данных (например, `hr_management`).
2. Выполните `schema.sql` для создания всех таблиц, индексов и триггеров.
3. (Опционально) выполните `seed.sql` для заполнения тестовыми данными.

После этого можно запускать бэкенд, который будет использовать эту структуру.