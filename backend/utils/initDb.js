import 'dotenv/config';
import sqlQuery from './db.js';
import bcrypt from 'bcrypt';

const initDb = async () => {
    try {
        // Create users table if not exists
        const createUserTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL
            )
        `;
        await sqlQuery(createUserTable);

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUser = `
            INSERT INTO users (username, email, password, role)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE email = email;
        `;

        await sqlQuery(adminUser, ['Admin', 'admin@example.com', hashedPassword, 'admin']);
        console.log('Admin user added successfully!');
    } catch (err) {
        console.error('Error initializing database:', err);
        console.error(err.sqlMessage);
    }
};

initDb();