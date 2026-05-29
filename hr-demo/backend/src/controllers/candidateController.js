const { pool } = require('../config/database');

const candidateController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT id, first_name as firstName, last_name as lastName, middle_name as middleName,
                       email, phone, position, status, DATE_FORMAT(created_at, '%Y-%m-%d') as createdAt
                FROM candidates_hr ORDER BY created_at DESC
            `);
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await pool.query(`
                SELECT id, first_name as firstName, last_name as lastName, middle_name as middleName,
                       email, phone, position, status, DATE_FORMAT(birth_date, '%Y-%m-%d') as birthDate,
                       notes, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as createdAt,
                       DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt
                FROM candidates_hr WHERE id = ?
            `, [id]);
            if (rows.length === 0) return res.status(404).json({ error: 'Candidate not found' });
            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { firstName, lastName, middleName, email, phone, position, status, birthDate, notes } = req.body;
            if (!firstName || !lastName) return res.status(400).json({ error: 'First name and last name are required' });
            const [result] = await pool.query(`
                INSERT INTO candidates_hr (first_name, last_name, middle_name, email, phone, position, status, birth_date, notes, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [firstName, lastName, middleName || null, email || null, phone || null, position || null, status || 'new', birthDate || null, notes || null]);
            res.status(201).json({ message: 'Candidate created successfully', id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const [result] = await pool.query('UPDATE candidates_hr SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Candidate not found' });
            res.json({ message: 'Candidate status updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const [result] = await pool.query('DELETE FROM candidates_hr WHERE id = ?', [id]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Candidate not found' });
            res.json({ message: 'Candidate deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = candidateController;