const { pool } = require('../config/database');

const vacancyController = {
    // GET /api/vacancies
    getAll: async (req, res) => {
        try {
            const { status } = req.query;
            
            let query = `
                SELECT 
                    v.id,
                    v.title,
                    v.description,
                    v.salary_min as salaryMin,
                    v.salary_max as salaryMax,
                    v.status,
                    d.id as departmentId,
                    d.name as departmentName,
                    DATE_FORMAT(v.created_at, '%Y-%m-%d') as createdAt,
                    DATE_FORMAT(v.closed_at, '%Y-%m-%d') as closedAt
                FROM vacancies_hr v
                LEFT JOIN departments_hr d ON v.department_id = d.id
                WHERE 1=1
            `;
            
            const params = [];
            
            if (status) {
                query += ` AND v.status = ?`;
                params.push(status);
            }
            
            query += ` ORDER BY v.created_at DESC`;
            
            const [rows] = await pool.query(query, params);
            
            res.json({ data: rows });
        } catch (error) {
            console.error('Error in getAll vacancies:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // GET /api/vacancies/:id
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [rows] = await pool.query(`
                SELECT 
                    v.id,
                    v.title,
                    v.description,
                    v.salary_min as salaryMin,
                    v.salary_max as salaryMax,
                    v.status,
                    v.department_id as departmentId,
                    d.name as departmentName,
                    DATE_FORMAT(v.created_at, '%Y-%m-%d %H:%i:%s') as createdAt,
                    DATE_FORMAT(v.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt,
                    DATE_FORMAT(v.closed_at, '%Y-%m-%d') as closedAt
                FROM vacancies_hr v
                LEFT JOIN departments_hr d ON v.department_id = d.id
                WHERE v.id = ?
            `, [id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Vacancy not found' });
            }
            
            res.json({ data: rows[0] });
        } catch (error) {
            console.error('Error in getById vacancy:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // POST /api/vacancies
    create: async (req, res) => {
        try {
            const { title, description, salaryMin, salaryMax, departmentId, status } = req.body;
            
            if (!title) {
                return res.status(400).json({ error: 'Vacancy title is required' });
            }
            
            const [result] = await pool.query(`
                INSERT INTO vacancies_hr (
                    title, description, salary_min, salary_max, 
                    department_id, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, NOW())
            `, [title, description || null, salaryMin || null, salaryMax || null,
                departmentId || null, status || 'open']);
            
            res.status(201).json({
                message: 'Vacancy created successfully',
                data: { id: result.insertId }
            });
        } catch (error) {
            console.error('Error in create vacancy:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // PUT /api/vacancies/:id
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, salaryMin, salaryMax, departmentId, status } = req.body;
            
            const [result] = await pool.query(`
                UPDATE vacancies_hr 
                SET title = COALESCE(?, title),
                    description = COALESCE(?, description),
                    salary_min = COALESCE(?, salary_min),
                    salary_max = COALESCE(?, salary_max),
                    department_id = COALESCE(?, department_id),
                    status = COALESCE(?, status),
                    updated_at = NOW()
                WHERE id = ?
            `, [title, description, salaryMin, salaryMax, departmentId, status, id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Vacancy not found' });
            }
            
            res.json({ message: 'Vacancy updated successfully' });
        } catch (error) {
            console.error('Error in update vacancy:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // PUT /api/vacancies/:id/close
    close: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [result] = await pool.query(`
                UPDATE vacancies_hr 
                SET status = 'closed', closed_at = NOW(), updated_at = NOW()
                WHERE id = ? AND status != 'closed'
            `, [id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Vacancy not found or already closed' });
            }
            
            res.json({ message: 'Vacancy closed successfully' });
        } catch (error) {
            console.error('Error in close vacancy:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // DELETE /api/vacancies/:id
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [result] = await pool.query('DELETE FROM vacancies_hr WHERE id = ?', [id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Vacancy not found' });
            }
            
            res.json({ message: 'Vacancy deleted successfully' });
        } catch (error) {
            console.error('Error in delete vacancy:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = vacancyController;