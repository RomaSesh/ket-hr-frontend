const { pool } = require('../config/database');

const employeeController = {
    // GET /api/employees
    getAll: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const { departmentId, search, isActive } = req.query;
            const offset = (page - 1) * limit;
            
            let query = `
                SELECT 
                    e.id,
                    e.first_name as firstName,
                    e.last_name as lastName,
                    e.middle_name as middleName,
                    e.email,
                    e.phone,
                    DATE_FORMAT(e.hire_date, '%Y-%m-%d') as hireDate,
                    e.is_active as isActive,
                    p.title as position,
                    p.id as positionId,
                    d.name as department,
                    d.id as departmentId
                FROM employees_hr e
                LEFT JOIN positions_hr p ON e.position_id = p.id
                LEFT JOIN departments_hr d ON e.department_id = d.id
                WHERE 1=1
            `;
            
            const params = [];
            
            if (departmentId) {
                query += ` AND e.department_id = ?`;
                params.push(departmentId);
            }
            
            if (isActive !== undefined) {
                query += ` AND e.is_active = ?`;
                params.push(isActive === 'true');
            }
            
            if (search) {
                query += ` AND (e.last_name LIKE ? OR e.first_name LIKE ? OR e.email LIKE ?)`;
                const searchTerm = `%${search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }
            
            query += ` ORDER BY e.last_name, e.first_name LIMIT ? OFFSET ?`;
            params.push(limit, offset);
            
            const [rows] = await pool.query(query, params);
            
            const [countResult] = await pool.query('SELECT COUNT(*) as total FROM employees_hr');
            
            res.json({
                data: rows,
                pagination: {
                    page,
                    limit,
                    total: countResult[0].total,
                    totalPages: Math.ceil(countResult[0].total / limit)
                }
            });
        } catch (error) {
            console.error('Error in getAll:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // GET /api/employees/:id
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [rows] = await pool.query(`
                SELECT 
                    e.id,
                    e.first_name as firstName,
                    e.last_name as lastName,
                    e.middle_name as middleName,
                    e.email,
                    e.phone,
                    DATE_FORMAT(e.hire_date, '%Y-%m-%d') as hireDate,
                    e.is_active as isActive,
                    e.created_at as createdAt,
                    e.updated_at as updatedAt,
                    p.id as positionId,
                    p.title as position,
                    p.salary_min as salaryMin,
                    p.salary_max as salaryMax,
                    d.id as departmentId,
                    d.name as department
                FROM employees_hr e
                LEFT JOIN positions_hr p ON e.position_id = p.id
                LEFT JOIN departments_hr d ON e.department_id = d.id
                WHERE e.id = ?
            `, [id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            
            res.json({ data: rows[0] });
        } catch (error) {
            console.error('Error in getById:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    // POST /api/employees
    create: async (req, res) => {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            const {
                firstName, lastName, middleName, email, phone,
                hireDate, positionId, departmentId, isActive
            } = req.body;
            
            if (!firstName || !lastName || !email || !hireDate || !positionId || !departmentId) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            
            const [result] = await connection.query(`
                INSERT INTO employees_hr (
                    first_name, last_name, middle_name, email, phone,
                    hire_date, position_id, department_id, is_active, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [firstName, lastName, middleName || null, email, phone || null,
                hireDate, positionId, departmentId, isActive !== false]);
            
            await connection.commit();
            
            res.status(201).json({
                message: 'Employee created successfully',
                data: { id: result.insertId }
            });
        } catch (error) {
            await connection.rollback();
            console.error('Error in create:', error);
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    },
    
    // PUT /api/employees/:id
    update: async (req, res) => {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            const { id } = req.params;
            const updates = req.body;
            
            const [existing] = await connection.query(
                'SELECT id FROM employees_hr WHERE id = ?',
                [id]
            );
            if (existing.length === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            
            const fields = [];
            const values = [];
            
            if (updates.firstName !== undefined) {
                fields.push('first_name = ?');
                values.push(updates.firstName);
            }
            if (updates.lastName !== undefined) {
                fields.push('last_name = ?');
                values.push(updates.lastName);
            }
            if (updates.middleName !== undefined) {
                fields.push('middle_name = ?');
                values.push(updates.middleName);
            }
            if (updates.email !== undefined) {
                fields.push('email = ?');
                values.push(updates.email);
            }
            if (updates.phone !== undefined) {
                fields.push('phone = ?');
                values.push(updates.phone);
            }
            if (updates.hireDate !== undefined) {
                fields.push('hire_date = ?');
                values.push(updates.hireDate);
            }
            if (updates.positionId !== undefined) {
                fields.push('position_id = ?');
                values.push(updates.positionId);
            }
            if (updates.departmentId !== undefined) {
                fields.push('department_id = ?');
                values.push(updates.departmentId);
            }
            if (updates.isActive !== undefined) {
                fields.push('is_active = ?');
                values.push(updates.isActive);
            }
            
            if (fields.length === 0) {
                return res.status(400).json({ error: 'No fields to update' });
            }
            
            fields.push('updated_at = NOW()');
            values.push(id);
            
            await connection.query(
                `UPDATE employees_hr SET ${fields.join(', ')} WHERE id = ?`,
                values
            );
            
            await connection.commit();
            
            res.json({ message: 'Employee updated successfully' });
        } catch (error) {
            await connection.rollback();
            console.error('Error in update:', error);
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    },
    
    // DELETE /api/employees/:id
    delete: async (req, res) => {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            const { id } = req.params;
            
            const [existing] = await connection.query(
                'SELECT id FROM employees_hr WHERE id = ?',
                [id]
            );
            if (existing.length === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            
            await connection.query(
                'UPDATE employees_hr SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
                [id]
            );
            
            await connection.commit();
            
            res.json({ message: 'Employee deactivated successfully' });
        } catch (error) {
            await connection.rollback();
            console.error('Error in delete:', error);
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    }
};

module.exports = employeeController;