import React from 'react';
import Layout from '../components/Layout';

const Help = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">❓ Помощь</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Добро пожаловать в HR-систему КЭТ</h2>
          <p className="text-gray-600 mb-4">
            Система предназначена для автоматизации управления сотрудниками, учёта отпусков,
            вакансий и формирования отчётов.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Основные разделы</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Дашборд</strong> – главная страница с метриками и последними событиями.</li>
            <li><strong>Сотрудники</strong> – просмотр, добавление, редактирование и удаление сотрудников.</li>
            <li><strong>Отпуска</strong> – создание заявок, утверждение/отклонение руководителем.</li>
            <li><strong>Вакансии</strong> – управление открытыми вакансиями.</li>
            <li><strong>Отчёты</strong> – численность сотрудников, статистика отпусков, текучесть.</li>
            <li><strong>Отделения/Кафедры</strong> – справочник отделов (CRUD).</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Быстрые действия</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Добавить сотрудника – кнопка «➕ Добавить сотрудника» на странице сотрудников.</li>
            <li>Создать заявку на отпуск – на странице отпусков нажмите «➕ Создать заявку».</li>
            <li>Утвердить/отклонить заявку – на странице отпусков напротив заявки со статусом «На рассмотрении».</li>
            <li>Изменить пароль – в разделе «Настройки».</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Контакты</h2>
          <p className="text-gray-600">
            По вопросам работы системы обращайтесь к разработчику:<br />
            <strong>Дружинин Роман</strong>, группа 3-2ИС<br />
            Email: r.druzhinin@ket-edu.ru
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Help;