const { pool } = require('../config/database');

const vacationController = {
    // GET /api/vacations
    getAll: async (req, res) => {
        try {
            const { status, employeeId, year } = req.query;
            
            let query = `
                SELECT 
                    v.id,
                    v.employee_id as employeeId,
                    CONCAT(e.last_name, ' ', e.first_name) as employeeName,
                    DATE_FORMAT(v.start_date, '%Y-%m-%d') as startDate,
                    DATE_FORMAT(v.end_date, '%Y-%m-%d') as endDate,
                    v.type,
                    v.status,
                    v.reason,
                    DATEDIFF(v.end_date, v.start_date) + 1 as daysCount,
                    DATE_FORMAT(v.created_at, '%Y-%m-%d') as createdAt,
                    DATE_FORMAT(v.approved_at, '%Y-%m-%d') as approvedAt
                FROM vacations_hr v
                JOIN employees_hr e ON v.employee_id = e.id
                WHERE 1=1
            `;
            
            const params = [];
            
            if (status) {
                query += ` AND v.status = ?`;
                params.push(status);
            }
            
            if (employeeId) {
                query += ` AND v.employee_id = ?`;
                params.push(employeeId);
            }
            
            if (year) {
                query += ` AND YEAR(v.start_date) = ?`;
                params.push(year);
            }
            
            query += ` ORDER BY v.start_date DESC`;
            
            const [rows] = await pool.query(query, params);
            
            res.json({ data: rows });
        } catch (error) {
            console.error('Error in getAll vacations:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // GET /api/vacations/:id
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [rows] = await pool.query(`
                SELECT 
                    v.id,
                    v.employee_id as employeeId,
                    CONCAT(e.last_name, ' ', e.first_name) as employeeName,
                    DATE_FORMAT(v.start_date, '%Y-%m-%d') as startDate,
                    DATE_FORMAT(v.end_date, '%Y-%m-%d') as endDate,
                    v.type,
                    v.status,
                    v.reason,
                    DATEDIFF(v.end_date, v.start_date) + 1 as daysCount,
                    DATE_FORMAT(v.created_at, '%Y-%m-%d %H:%i:%s') as createdAt,
                    DATE_FORMAT(v.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt,
                    DATE_FORMAT(v.approved_at, '%Y-%m-%d %H:%i:%s') as approvedAt
                FROM vacations_hr v
                JOIN employees_hr e ON v.employee_id = e.id
                WHERE v.id = ?
            `, [id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Vacation not found' });
            }
            
            res.json({ data: rows[0] });
        } catch (error) {
            console.error('Error in getById vacation:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // POST /api/vacations
    create: async (req, res) => {
        try {
            const { employeeId, startDate, endDate, type, reason } = req.body;
            
            if (!employeeId || !startDate || !endDate) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            
            const [result] = await pool.query(`
                INSERT INTO vacations_hr (
                    employee_id, start_date, end_date, type, status, reason, created_at
                ) VALUES (?, ?, ?, ?, 'pending', ?, NOW())
            `, [employeeId, startDate, endDate, type || 'annual', reason || null]);
            
            res.status(201).json({
                message: 'Vacation request created successfully',
                data: { id: result.insertId }
            });
        } catch (error) {
            console.error('Error in create vacation:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // PUT /api/vacations/:id/approve
    approve: async (req, res) => {
        try {
            const { id } = req.params;
            const { approvedBy } = req.body;
            
            const [result] = await pool.query(`
                UPDATE vacations_hr 
                SET status = 'approved', 
                    approved_by = ?,
                    approved_at = NOW(),
                    updated_at = NOW()
                WHERE id = ? AND status = 'pending'
            `, [approvedBy || null, id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Vacation not found or already processed' });
            }
            
            res.json({ message: 'Vacation approved successfully' });
        } catch (error) {
            console.error('Error in approve vacation:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // PUT /api/vacations/:id/reject
    reject: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [result] = await pool.query(`
                UPDATE vacations_hr 
                SET status = 'rejected', updated_at = NOW()
                WHERE id = ? AND status = 'pending'
            `, [id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Vacation not found or already processed' });
            }
            
            res.json({ message: 'Vacation rejected successfully' });
        } catch (error) {
            console.error('Error in reject vacation:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // DELETE /api/vacations/:id
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [result] = await pool.query('DELETE FROM vacations_hr WHERE id = ?', [id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Vacation not found' });
            }
            
            res.json({ message: 'Vacation deleted successfully' });
        } catch (error) {
            console.error('Error in delete vacation:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = vacationController;