const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/database');
const employeeRoutes = require('./routes/employees');
const departmentRoutes = require('./routes/departments');
const positionRoutes = require('./routes/positions');
const candidateRoutes = require('./routes/candidates');
const vacancyRoutes = require('./routes/vacancies');
const vacationRoutes = require('./routes/vacations');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');   // добавить

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);   // добавить

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

const startServer = async () => {
    const dbConnected = await testConnection();
    if (!dbConnected) {
        console.error('Cannot start server without database connection');
        process.exit(1);
    }
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
};

startServer();

module.exports = app;