-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Май 31 2026 г., 19:45
-- Версия сервера: 8.0.30
-- Версия PHP: 8.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `i91590fx_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `candidates_hr`
--

CREATE TABLE `candidates_hr` (
  `id` int NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `middle_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('new','review','interview','offered','hired','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `birth_date` date DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `candidates_hr`
--

INSERT INTO `candidates_hr` (`id`, `first_name`, `last_name`, `middle_name`, `email`, `phone`, `position`, `status`, `birth_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'Дмитрий', 'Волков', 'Сергеевич', 'dmitry.volkov@mail.ru', '+7 (999) 777-88-99', 'Разработчик PHP', 'interview', NULL, 'Хорошее портфолио', '2026-04-26 21:31:47', '2026-05-27 15:56:46'),
(2, 'Ольга', 'Морозова', NULL, 'olga.morozova@mail.ru', '+7 (999) 888-99-00', 'HR-менеджер', 'review', NULL, 'Опыт работы 5 лет', '2026-04-26 21:31:47', '2026-05-27 15:56:46'),
(3, 'Сергей', 'Павлов', 'Николаевич', 'sergey.pavlov@mail.ru', '+7 (999) 999-00-11', 'Бухгалтер', 'new', NULL, 'Ищет работу', '2026-04-26 21:31:47', '2026-05-27 15:56:46');

-- --------------------------------------------------------

--
-- Структура таблицы `departments_hr`
--

CREATE TABLE `departments_hr` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `departments_hr`
--

INSERT INTO `departments_hr` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'IT', 'Информационные технологии и разработка', '2026-04-26 21:31:47', '2026-05-27 15:56:47'),
(2, 'HR', 'Отдел кадров и управления персоналом', '2026-04-26 21:31:47', '2026-05-27 15:56:47'),
(3, 'Финансы', 'Финансовый департамент, бухгалтерия', '2026-04-26 21:31:47', '2026-05-27 15:56:47'),
(4, 'Маркетинг', 'Отдел маркетинга и рекламы', '2026-04-26 21:31:47', '2026-05-27 15:56:47'),
(5, 'Продажи', 'Отдел продаж и работы с клиентами', '2026-04-26 21:31:47', '2026-05-27 15:56:47');

-- --------------------------------------------------------

--
-- Структура таблицы `employees_hr`
--

CREATE TABLE `employees_hr` (
  `id` int NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `middle_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_id` int NOT NULL,
  `department_id` int NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hire_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `personnel_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `education` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialty` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `employees_hr`
--

INSERT INTO `employees_hr` (`id`, `first_name`, `last_name`, `middle_name`, `position_id`, `department_id`, `email`, `phone`, `hire_date`, `is_active`, `created_at`, `updated_at`, `personnel_number`, `birth_date`, `education`, `specialty`, `experience`, `address`) VALUES
(1, 'Иван', 'Иванов', 'Иванович', 1, 1, 'ivan.ivanov@company.ru', '+7 (999) 111-22-33', '2020-01-15', 1, '2026-04-26 21:31:47', '2026-05-29 06:07:10', NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Анна', 'Петрова', 'Сергеевна', 2, 2, 'anna.petrova@company.ru', '+7 (999) 222-33-44', '2019-05-20', 1, '2026-04-26 21:31:47', '2026-05-27 15:56:47', NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Петр', 'Сидоров', 'Петрович', 3, 3, 'petr.sidorov@company.ru', '+7 (999) 333-44-55', '2021-08-10', 0, '2026-04-26 21:31:47', '2026-05-27 15:56:47', NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Мария', 'Смирнова', NULL, 2, 2, 'maria.smirnova@company.ru', '+7 (999) 444-55-66', '2022-03-01', 1, '2026-04-26 21:31:47', '2026-05-27 15:56:47', NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Алексей', 'Козлов', 'Дмитриевич', 4, 4, 'alexey.kozlov@company.ru', '+7 (999) 555-66-77', '2021-11-10', 1, '2026-04-26 21:31:47', '2026-05-27 15:56:47', NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'Елена', 'Новикова', 'Андреевна', 5, 5, 'elena.novikova@company.ru', '+7 (999) 666-77-88', '2023-01-20', 1, '2026-04-26 21:31:47', '2026-05-27 15:56:47', NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'Дружинин', 'Роман', NULL, 2, 1, 'rdruzinin52@gmail.com', '', '2000-04-13', 1, '2026-05-28 17:36:02', '2026-05-29 05:54:42', NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Триггеры `employees_hr`
--
DELIMITER $$
CREATE TRIGGER `trigger_employees_hr_before_update` BEFORE UPDATE ON `employees_hr` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trigger_employees_hr_status_change` BEFORE UPDATE ON `employees_hr` FOR EACH ROW BEGIN
    IF OLD.is_active != NEW.is_active THEN
        INSERT INTO employee_history_hr (employee_id, action, field_name, old_value, new_value, changed_at)
        VALUES (NEW.id, 'UPDATE', 'is_active', OLD.is_active, NEW.is_active, NOW());
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `employee_history_hr`
--

CREATE TABLE `employee_history_hr` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `action` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `new_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `changed_by` int DEFAULT NULL,
  `changed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `employee_history_hr`
--

INSERT INTO `employee_history_hr` (`id`, `employee_id`, `action`, `field_name`, `old_value`, `new_value`, `changed_by`, `changed_at`) VALUES
(1, 3, 'UPDATE', 'is_active', 'true', 'false', 3, '2026-04-26 21:31:47'),
(0, 1, 'UPDATE', 'is_active', '1', '0', NULL, '2026-05-29 06:01:53'),
(0, 1, 'UPDATE', 'is_active', '0', '1', NULL, '2026-05-29 06:07:10');

-- --------------------------------------------------------

--
-- Структура таблицы `positions_hr`
--

CREATE TABLE `positions_hr` (
  `id` int NOT NULL,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `positions_hr`
--

INSERT INTO `positions_hr` (`id`, `title`, `salary_min`, `salary_max`, `department_id`, `created_at`) VALUES
(1, 'Разработчик', '80000.00', '150000.00', 1, '2026-04-26 21:31:47'),
(2, 'HR-менеджер', '50000.00', '80000.00', 2, '2026-04-26 21:31:47'),
(3, 'Бухгалтер', '60000.00', '100000.00', 3, '2026-04-26 21:31:47'),
(4, 'Маркетолог', '55000.00', '90000.00', 4, '2026-04-26 21:31:47'),
(5, 'Менеджер по продажам', '45000.00', '120000.00', 5, '2026-04-26 21:31:47');

-- --------------------------------------------------------

--
-- Структура таблицы `users_hr`
--

CREATE TABLE `users_hr` (
  `id` int NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('hr','manager','admin','employee') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` int DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_blocked` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users_hr`
--

INSERT INTO `users_hr` (`id`, `username`, `password_hash`, `email`, `role`, `employee_id`, `last_login`, `created_at`, `is_blocked`) VALUES
(2, 'ivanov_i', '$2y$10$YourHashedPasswordHere', 'ivan.ivanov@company.ru', 'employee', 1, NULL, '2026-04-26 21:31:47', 0),
(3, 'petrova_a', '$2y$10$YourHashedPasswordHere', 'anna.petrova@company.ru', 'admin', 2, NULL, '2026-04-26 21:31:47', 0),
(4, 'smirnova_m', '$2y$10$YourHashedPasswordHere', 'maria.smirnova@company.ru', 'hr', 4, NULL, '2026-04-26 21:31:47', 0),
(5, 'kozlov_a', '$2y$10$YourHashedPasswordHere', 'alexey.kozlov@company.ru', 'employee', 5, NULL, '2026-04-26 21:31:47', 0),
(10, 'admin', '$2b$10$S5T6WX9J/Ui8fA1bOSNbve/AUzzh73QenK3.7jYYoyFdMLbntRcvi', 'admin@company.ru', 'admin', NULL, '2026-05-31 16:10:47', '2026-05-27 18:30:57', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `vacancies_hr`
--

CREATE TABLE `vacancies_hr` (
  `id` int NOT NULL,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `status` enum('open','closed','on_hold') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `vacancies_hr`
--

INSERT INTO `vacancies_hr` (`id`, `title`, `description`, `salary_min`, `salary_max`, `department_id`, `status`, `created_at`, `updated_at`, `closed_at`) VALUES
(1, 'PHP Разработчик', 'Ищем опытного PHP разработчика', '100000.00', '180000.00', 1, 'open', '2026-04-26 21:31:47', '2026-05-27 15:56:47', NULL),
(2, 'HR-специалист', 'В отдел кадров требуется специалист', '60000.00', '90000.00', 2, 'open', '2026-04-26 21:31:47', '2026-05-27 15:56:47', NULL),
(3, 'Product Manager', 'Руководитель продукта', '120000.00', '200000.00', 1, 'closed', '2026-04-26 21:31:47', '2026-05-27 15:56:47', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `vacations_hr`
--

CREATE TABLE `vacations_hr` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `type` enum('annual','sick','unpaid','maternity') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'annual',
  `status` enum('pending','approved','rejected','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `vacations_hr`
--

INSERT INTO `vacations_hr` (`id`, `employee_id`, `start_date`, `end_date`, `type`, `status`, `reason`, `approved_by`, `approved_at`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-07-01', '2024-07-14', 'annual', 'approved', 'Ежегодный отпуск', NULL, NULL, '2026-04-26 21:31:47', '2026-05-27 15:56:47'),
(2, 2, '2024-08-15', '2024-08-29', 'annual', 'pending', 'Отпуск', NULL, NULL, '2026-04-26 21:31:47', '2026-05-27 15:56:47'),
(3, 4, '2024-06-10', '2024-06-12', 'sick', 'approved', 'Больничный', NULL, NULL, '2026-04-26 21:31:47', '2026-05-27 15:56:47');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `employees_hr`
--
ALTER TABLE `employees_hr`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personnel_number` (`personnel_number`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `employees_hr`
--
ALTER TABLE `employees_hr`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
