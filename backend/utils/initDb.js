import 'dotenv/config';
import sqlQuery from './db.js';
import bcrypt from 'bcrypt';

const initDb = async () => {
    try {
        // Create users table
        const createUserTable = `
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20),
                passport_number VARCHAR(50) UNIQUE
            )
        `;
        await sqlQuery(createUserTable);

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUser = `
            INSERT INTO users (username, email, password, phone_number, passport_number)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE email = VALUES(email);
        `;

        await sqlQuery(adminUser, ['Admin', 'admin@example.com', hashedPassword, '1234567890', 'ABC123']);
        console.log('Admin user added successfully!');

        // Create airports table
        const createAirportsTable = `
            CREATE TABLE IF NOT EXISTS airports (
                airport_id INT AUTO_INCREMENT PRIMARY KEY,
                airport_name VARCHAR(255) NOT NULL,
                city VARCHAR(100) NOT NULL
            )
        `;
        await sqlQuery(createAirportsTable);

        // Create airlines table
        const createAirlinesTable = `
            CREATE TABLE IF NOT EXISTS airlines (
                airline_id INT AUTO_INCREMENT PRIMARY KEY,
                airline_name VARCHAR(255) NOT NULL
            )
        `;
        await sqlQuery(createAirlinesTable);

        // Create flights table
        const createFlightsTable = `
            CREATE TABLE IF NOT EXISTS flights (
                flight_id INT AUTO_INCREMENT PRIMARY KEY,
                departure_time DATETIME NOT NULL,
                arrival_time DATETIME NOT NULL,
                departure_station INT,
                arrival_station INT,
                terminal VARCHAR(50),
                airline_id INT,
                FOREIGN KEY (departure_station) REFERENCES airports(airport_id) ON DELETE SET NULL,
                FOREIGN KEY (arrival_station) REFERENCES airports(airport_id) ON DELETE SET NULL,
                FOREIGN KEY (airline_id) REFERENCES airlines(airline_id) ON DELETE CASCADE
            )
        `;
        await sqlQuery(createFlightsTable);

        // Create bookings table
        const createBookingsTable = `
            CREATE TABLE IF NOT EXISTS bookings (
                booking_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                flight_id INT,
                booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
            )
        `;
        await sqlQuery(createBookingsTable);

        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing database:', err);
        console.error(err.sqlMessage);
    }
};

export default initDb;
