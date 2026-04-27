const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
    // POST /api/auth/login
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            
            console.log(`Login attempt: ${username}`);
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }
            
            const [users] = await pool.query(`
                SELECT 
                    u.id,
                    u.username,
                    u.password_hash,
                    u.email,
                    u.role,
                    u.employee_id,
                    e.first_name,
                    e.last_name,
                    e.is_active
                FROM users_hr u
                LEFT JOIN employees_hr e ON u.employee_id = e.id
                WHERE u.username = ? OR u.email = ?
            `, [username, username]);
            
            if (users.length === 0) {
                console.log(`User not found: ${username}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const user = users[0];
            
            // Проверка пароля (поддерживает как bcrypt, так и обычные пароли для тестов)
            let isValidPassword;
            if (user.password_hash.startsWith('$2')) {
                isValidPassword = await bcrypt.compare(password, user.password_hash);
            } else {
                isValidPassword = password === user.password_hash;
            }
            
            if (!isValidPassword) {
                console.log(`Invalid password for user: ${username}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            // Update last login
            await pool.query(`
                UPDATE users_hr SET last_login = NOW() WHERE id = ?
            `, [user.id]);
            
            const token = jwt.sign(
                { 
                    id: user.id, 
                    username: user.username, 
                    role: user.role,
                    employeeId: user.employee_id 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            console.log(`User logged in successfully: ${username}`);
            
            res.json({
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        firstName: user.first_name,
                        lastName: user.last_name
                    }
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // POST /api/auth/register (только для админов)
    register: async (req, res) => {
        try {
            const { username, password, email, role, employeeId } = req.body;
            
            if (!username || !password || !email) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            
            // Check if user exists
            const [existing] = await pool.query(
                'SELECT id FROM users_hr WHERE username = ? OR email = ?',
                [username, email]
            );
            
            if (existing.length > 0) {
                return res.status(400).json({ error: 'Username or email already exists' });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const [result] = await pool.query(`
                INSERT INTO users_hr (username, password_hash, email, role, employee_id, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())
            `, [username, hashedPassword, email, role || 'employee', employeeId || null]);
            
            res.status(201).json({
                message: 'User created successfully',
                data: { id: result.insertId }
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // GET /api/auth/me
    getMe: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const [users] = await pool.query(`
                SELECT u.id, u.username, u.email, u.role, u.employee_id, u.last_login,
                       e.first_name, e.last_name, e.is_active
                FROM users_hr u
                LEFT JOIN employees_hr e ON u.employee_id = e.id
                WHERE u.id = ?
            `, [decoded.id]);
            
            if (users.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            res.json({ data: users[0] });
        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;