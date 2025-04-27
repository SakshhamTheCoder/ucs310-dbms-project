// initDb.js — MERGED VERSION (A + B)
import 'dotenv/config';
import sqlQuery from './db.js';
import bcrypt from 'bcrypt';

const initDb = async () => {
  try {
    console.log('Initializing database...');

    // ─── Users ────────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS users (
        user_id         INT AUTO_INCREMENT PRIMARY KEY,
        username        VARCHAR(100) NOT NULL,
        email           VARCHAR(100) UNIQUE NOT NULL,
        password        VARCHAR(255) NOT NULL,
        phone_number    VARCHAR(20),
        passport_number VARCHAR(50) UNIQUE
      )
    `);
    console.log('Users table OK');

    // Seed admin user (with updated credentials)
    const hashedPassword = await bcrypt.hash('BossPass!2', 10);
    await sqlQuery(
      `INSERT INTO users (
         username, email, password, phone_number, passport_number
       ) VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE username = username`,
      ['Admin', 'boss@flightcorp.com', hashedPassword, '9001122334', 'B123456']
    );
    console.log('Admin user OK');

    // ─── Airports ─────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS airports (
        airport_id   INT AUTO_INCREMENT PRIMARY KEY,
        airport_name VARCHAR(255)     NOT NULL,
        city         VARCHAR(100)     NOT NULL
      )
    `);
    console.log('Airports table OK');

    // ─── Airlines ─────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS airlines (
        airline_id   INT AUTO_INCREMENT PRIMARY KEY,
        airline_name VARCHAR(255)     NOT NULL
      )
    `);
    console.log('Airlines table OK');

    // ─── Flights ──────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS flights (
        flight_id          INT AUTO_INCREMENT PRIMARY KEY,
        departure_time     DATETIME                NOT NULL,
        arrival_time       DATETIME                NOT NULL,
        departure_station  INT,
        arrival_station    INT,
        terminal           VARCHAR(50),
        airline_id         INT,
        FOREIGN KEY (departure_station)
          REFERENCES airports(airport_id) ON DELETE SET NULL,
        FOREIGN KEY (arrival_station)
          REFERENCES airports(airport_id) ON DELETE SET NULL,
        FOREIGN KEY (airline_id)
          REFERENCES airlines(airline_id) ON DELETE CASCADE
      )
    `);
    console.log('Flights table OK');

    // ─── Bookings ─────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS bookings (
        booking_id   INT AUTO_INCREMENT PRIMARY KEY,
        user_id      INT,
        flight_id    INT,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
          REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (flight_id)
          REFERENCES flights(flight_id) ON DELETE CASCADE
      )
    `);
    console.log('Bookings table OK');

    // ─── Passengers ────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS passengers (
        passenger_id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id   INT         NOT NULL,
        name         VARCHAR(150) NOT NULL,
        age          INT         NOT NULL,
        gender       ENUM('M','F','O') NOT NULL,
        passport_no  VARCHAR(50) UNIQUE,
        created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id)
          REFERENCES bookings(booking_id) ON DELETE CASCADE
      )
    `);
    console.log('Passengers table OK');

    // ─── Services ──────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS services (
        service_id  INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        description TEXT,
        price       DECIMAL(8,2) NOT NULL,
        created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Services table OK');

    // ─── Booking ↔ Services Join ───────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS booking_services (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        booking_id  INT         NOT NULL,
        service_id  INT         NOT NULL,
        quantity    INT         NOT NULL DEFAULT 1,
        added_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id)
          REFERENCES bookings(booking_id) ON DELETE CASCADE,
        FOREIGN KEY (service_id)
          REFERENCES services(service_id) ON DELETE RESTRICT
      )
    `);
    console.log('Booking_Services table OK');

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
    console.error(err.sqlMessage);
  }
};

export default initDb;
