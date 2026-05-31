const jwt = require('jsonwebtoken');
const { pool } = require('../config/database'); // !!! добавить импорт

const authMiddleware = async (req, res, next) => {   // сделать async
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Проверка блокировки
        //const [rows] = await pool.query('SELECT is_blocked FROM users_hr WHERE id = ?', [decoded.id]);
        //if (rows.length === 0 || rows[0].is_blocked) {
          //  return res.status(401).json({ error: 'User is blocked.' });
       // }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };