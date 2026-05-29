const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
    // POST /api/auth/login – возвращает access_token
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
            const [users] = await pool.query(`
                SELECT u.id, u.username, u.password_hash, u.email, u.role, u.employee_id,
                       e.first_name, e.last_name, e.is_active
                FROM users_hr u
                LEFT JOIN employees_hr e ON u.employee_id = e.id
                WHERE u.username = ? OR u.email = ?
            `, [username, username]);
            if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
            const user = users[0];
            let isValidPassword;
            if (user.password_hash.startsWith('$2')) {
                isValidPassword = await bcrypt.compare(password, user.password_hash);
            } else {
                isValidPassword = password === user.password_hash;
            }
            if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });
            await pool.query('UPDATE users_hr SET last_login = NOW() WHERE id = ?', [user.id]);
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role, employeeId: user.employee_id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            // ✅ правильный формат для фронтенда
            res.json({ access_token: token, token_type: 'bearer' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/auth/register
    register: async (req, res) => {
        try {
            const { username, password, email, role, employeeId } = req.body;
            if (!username || !password || !email) return res.status(400).json({ error: 'Missing required fields' });
            const [existing] = await pool.query('SELECT id FROM users_hr WHERE username = ? OR email = ?', [username, email]);
            if (existing.length > 0) return res.status(400).json({ error: 'Username or email already exists' });
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await pool.query(`
                INSERT INTO users_hr (username, password_hash, email, role, employee_id, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())
            `, [username, hashedPassword, email, role || 'employee', employeeId || null]);
            res.status(201).json({ message: 'User created successfully', id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/auth/me – возвращает объект пользователя
    getMe: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(401).json({ error: 'No token provided' });
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const [users] = await pool.query(`
                SELECT u.id, u.username, u.email, u.role, u.employee_id, u.last_login,
                       e.first_name, e.last_name, e.is_active
                FROM users_hr u
                LEFT JOIN employees_hr e ON u.employee_id = e.id
                WHERE u.id = ?
            `, [decoded.id]);
            if (users.length === 0) return res.status(404).json({ error: 'User not found' });
            res.json(users[0]);   // без обёртки
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /api/auth/change-password (новый метод)
    changePassword: async (req, res) => {
        try {
            const { current_password, new_password } = req.body;
            const userId = req.user.id;
            const [users] = await pool.query('SELECT password_hash FROM users_hr WHERE id = ?', [userId]);
            if (users.length === 0) return res.status(404).json({ error: 'User not found' });
            const valid = await bcrypt.compare(current_password, users[0].password_hash);
            if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
            const newHash = await bcrypt.hash(new_password, 10);
            await pool.query('UPDATE users_hr SET password_hash = ? WHERE id = ?', [newHash, userId]);
            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;