const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const adminController = {
    getAllUsers: async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT u.id, u.username, u.email, u.role, u.employee_id, 
                       u.last_login, u.created_at, u.is_blocked,
                       e.first_name, e.last_name, e.is_active as employee_active
                FROM users_hr u
                LEFT JOIN employees_hr e ON u.employee_id = e.id
                ORDER BY u.id
            `);
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    createUser: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const { username, email, password, role, employee_id } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'Username, email and password required' });
            }
            const [existing] = await connection.query(
                'SELECT id FROM users_hr WHERE username = ? OR email = ?',
                [username, email]
            );
            if (existing.length > 0) {
                return res.status(400).json({ error: 'Username or email already exists' });
            }
            if (employee_id) {
                const [emp] = await connection.query('SELECT id FROM employees_hr WHERE id = ?', [employee_id]);
                if (emp.length === 0) return res.status(400).json({ error: 'Employee not found' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await connection.query(
                `INSERT INTO users_hr (username, password_hash, email, role, employee_id, created_at)
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [username, hashedPassword, email, role || 'employee', employee_id || null]
            );
            await connection.commit();
            res.status(201).json({ message: 'User created', id: result.insertId });
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    },

    updateUserRole: async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!['admin', 'hr', 'manager', 'employee'].includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }
            const [result] = await pool.query('UPDATE users_hr SET role = ? WHERE id = ?', [role, id]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
            res.json({ message: 'Role updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { id } = req.params;
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashed = await bcrypt.hash(tempPassword, 10);
            const [result] = await pool.query('UPDATE users_hr SET password_hash = ? WHERE id = ?', [hashed, id]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
            res.json({ message: 'Password reset', temporary_password: tempPassword });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    blockUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { blocked } = req.body;
            const [result] = await pool.query('UPDATE users_hr SET is_blocked = ? WHERE id = ?', [blocked ? 1 : 0, id]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
            res.json({ message: blocked ? 'User blocked' : 'User unblocked' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = adminController;