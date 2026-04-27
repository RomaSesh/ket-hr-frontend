const { pool } = require('../config/database');

const positionController = {
    // GET /api/positions
    getAll: async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    p.id,
                    p.title,
                    p.salary_min as salaryMin,
                    p.salary_max as salaryMax,
                    p.department_id as departmentId,
                    d.name as departmentName,
                    p.created_at as createdAt,
                    COUNT(e.id) as employeeCount
                FROM positions_hr p
                LEFT JOIN departments_hr d ON p.department_id = d.id
                LEFT JOIN employees_hr e ON p.id = e.position_id AND e.is_active = TRUE
                GROUP BY p.id
                ORDER BY p.title
            `);
            
            res.json({ data: rows });
        } catch (error) {
            console.error('Error in getAll positions:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // GET /api/positions/:id
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [rows] = await pool.query(`
                SELECT 
                    p.id,
                    p.title,
                    p.salary_min as salaryMin,
                    p.salary_max as salaryMax,
                    p.department_id as departmentId,
                    d.name as departmentName,
                    p.created_at as createdAt,
                    p.updated_at as updatedAt
                FROM positions_hr p
                LEFT JOIN departments_hr d ON p.department_id = d.id
                WHERE p.id = ?
            `, [id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Position not found' });
            }
            
            res.json({ data: rows[0] });
        } catch (error) {
            console.error('Error in getById position:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // POST /api/positions
    create: async (req, res) => {
        try {
            const { title, salaryMin, salaryMax, departmentId } = req.body;
            
            if (!title) {
                return res.status(400).json({ error: 'Position title is required' });
            }
            
            const [result] = await pool.query(`
                INSERT INTO positions_hr (title, salary_min, salary_max, department_id, created_at)
                VALUES (?, ?, ?, ?, NOW())
            `, [title, salaryMin || null, salaryMax || null, departmentId || null]);
            
            res.status(201).json({
                message: 'Position created successfully',
                data: { id: result.insertId }
            });
        } catch (error) {
            console.error('Error in create position:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // PUT /api/positions/:id
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, salaryMin, salaryMax, departmentId } = req.body;
            
            const [result] = await pool.query(`
                UPDATE positions_hr 
                SET title = COALESCE(?, title),
                    salary_min = COALESCE(?, salary_min),
                    salary_max = COALESCE(?, salary_max),
                    department_id = COALESCE(?, department_id),
                    updated_at = NOW()
                WHERE id = ?
            `, [title, salaryMin, salaryMax, departmentId, id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Position not found' });
            }
            
            res.json({ message: 'Position updated successfully' });
        } catch (error) {
            console.error('Error in update position:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // DELETE /api/positions/:id
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [employees] = await pool.query(
                'SELECT COUNT(*) as count FROM employees_hr WHERE position_id = ? AND is_active = TRUE',
                [id]
            );
            
            if (employees[0].count > 0) {
                return res.status(400).json({ 
                    error: 'Cannot delete position with active employees' 
                });
            }
            
            const [result] = await pool.query('DELETE FROM positions_hr WHERE id = ?', [id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Position not found' });
            }
            
            res.json({ message: 'Position deleted successfully' });
        } catch (error) {
            console.error('Error in delete position:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = positionController;