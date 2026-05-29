const { pool } = require('../config/database');

exports.getHeadcount = async (req, res) => {
    try {
        const [totalRes] = await pool.query('SELECT COUNT(*) as total FROM employees_hr WHERE is_active = 1');
        const total = totalRes[0].total;
        const [byDept] = await pool.query(`
            SELECT d.name as department, COUNT(e.id) as count
            FROM departments_hr d
            LEFT JOIN employees_hr e ON d.id = e.department_id AND e.is_active = 1
            GROUP BY d.id
            ORDER BY d.name
        `);
        res.json({ total, by_department: byDept });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVacationStats = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT MONTHNAME(start_date) as month, COUNT(*) as count
            FROM vacations_hr
            WHERE status = 'approved'
            GROUP BY MONTH(start_date)
            ORDER BY MONTH(start_date)
        `);
        res.json({ data: rows });   // фронтенд ожидает { data: [...] }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTurnover = async (req, res) => {
    try {
        const [total] = await pool.query('SELECT COUNT(*) as total FROM employees_hr');
        const [fired] = await pool.query('SELECT COUNT(*) as fired FROM employees_hr WHERE is_active = 0');
        const totalEmployees = total[0].total;
        const firedCount = fired[0].fired;
        const turnoverRate = totalEmployees ? ((firedCount / totalEmployees) * 100).toFixed(2) : 0;
        res.json({ total_employees: totalEmployees, fired: firedCount, turnover_rate: turnoverRate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};