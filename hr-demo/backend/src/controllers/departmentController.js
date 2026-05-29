const { pool } = require('../config/database');

const departmentController = {
    // GET /api/departments – массив
    getAll: async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    d.id,
                    d.name,
                    d.description,
                    d.created_at as createdAt,
                    d.updated_at as updatedAt,
                    COUNT(e.id) as employeeCount,
                    SUM(CASE WHEN e.is_active = TRUE THEN 1 ELSE 0 END) as activeEmployees
                FROM departments_hr d
                LEFT JOIN employees_hr e ON d.id = e.department_id
                GROUP BY d.id
                ORDER BY d.name
            `);
            res.json(rows);
        } catch (error) {
            console.error('Ошибка в getAll:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/departments/:id – объект
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await pool.query(`
                SELECT id, name, description, created_at as createdAt, updated_at as updatedAt
                FROM departments_hr WHERE id = ?
            `, [id]);
            if (rows.length === 0) return res.status(404).json({ error: 'Department not found' });
            res.json(rows[0]);
        } catch (error) {
            console.error('Ошибка в getById:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/departments
    create: async (req, res) => {
        try {
            const { name, description } = req.body;
            if (!name) return res.status(400).json({ error: 'Department name is required' });
            
            const [result] = await pool.query(
                'INSERT INTO departments_hr (name, description, created_at) VALUES (?, ?, NOW())',
                [name, description || null]
            );
            // Возвращаем созданный отдел
            const [newDept] = await pool.query('SELECT id, name, description, created_at as createdAt FROM departments_hr WHERE id = ?', [result.insertId]);
            res.status(201).json(newDept[0]);
        } catch (error) {
            console.error('Ошибка в create:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /api/departments/:id
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            
            if (!name) return res.status(400).json({ error: 'Department name is required' });
            
            // Проверяем, существует ли отдел
            const [exists] = await pool.query('SELECT id FROM departments_hr WHERE id = ?', [id]);
            if (exists.length === 0) {
                return res.status(404).json({ error: 'Department not found' });
            }
            
            // Обновляем
            await pool.query(
                'UPDATE departments_hr SET name = ?, description = ?, updated_at = NOW() WHERE id = ?',
                [name, description || null, id]
            );
            
            // Возвращаем обновлённые данные
            const [updated] = await pool.query('SELECT id, name, description, created_at as createdAt, updated_at as updatedAt FROM departments_hr WHERE id = ?', [id]);
            res.json(updated[0]);
        } catch (error) {
            console.error('Ошибка в update:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /api/departments/:id
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Проверяем, есть ли сотрудники в отделе
            const [employees] = await pool.query('SELECT COUNT(*) as count FROM employees_hr WHERE department_id = ?', [id]);
            if (employees[0].count > 0) {
                return res.status(400).json({ error: 'Cannot delete department with employees. Move or fire employees first.' });
            }
            
            const [result] = await pool.query('DELETE FROM departments_hr WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Department not found' });
            }
            res.json({ message: 'Department deleted successfully' });
        } catch (error) {
            console.error('Ошибка в delete:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = departmentController;