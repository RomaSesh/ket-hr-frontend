const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL connected successfully');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        console.log(`🔌 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        console.log(`👤 User: ${process.env.DB_USER}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        console.error('Please check your database credentials in .env file');
        return false;
    }
};

module.exports = { pool, testConnection };