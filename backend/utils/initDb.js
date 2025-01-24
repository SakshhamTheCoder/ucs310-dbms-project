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

        // Create quizzes and related tables
        const createTables = [
            `CREATE TABLE IF NOT EXISTS quizzes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`,

            `CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                quiz_id INT,
                question_text TEXT NOT NULL,
                FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
            )`,

            `CREATE TABLE IF NOT EXISTS options (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question_id INT,
                text VARCHAR(255) NOT NULL,
                is_correct BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
            )`
        ];

        for (const tableQuery of createTables) {
            await sqlQuery(tableQuery);
        }

        console.log('Quiz-related tables created successfully!');
    } catch (err) {
        console.error('Error initializing database:', err);
        console.error(err.sqlMessage);
    }
};

export default initDb;