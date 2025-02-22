import { createPool } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

console.log('Database Config:', {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const pool = createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const sqlQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

export default sqlQuery;