// initDb.js — Merged Version (A + B)
import 'dotenv/config';
import sqlQuery from './db.js';
import bcrypt from 'bcrypt';

const initDb = async () => {
  try {
    console.log('Initializing database...');

    // ─── Roles ────────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS roles (
        role_id INT AUTO_INCREMENT PRIMARY KEY,
        role_name VARCHAR(50) NOT NULL UNIQUE
      )
    `);
    console.log('Roles table OK');

    // Seed roles table before inserting admin user
    await sqlQuery(`
      INSERT INTO roles (role_name)
      VALUES ('admin'), ('user')
      ON DUPLICATE KEY UPDATE role_name = role_name
    `);
    console.log('Roles seeded successfully');

    // Update users table to reference roles
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS users (
        user_id         INT AUTO_INCREMENT PRIMARY KEY,
        username        VARCHAR(100) NOT NULL,
        email           VARCHAR(100) UNIQUE NOT NULL,
        password        VARCHAR(255) NOT NULL,
        phone_number    VARCHAR(20),
        passport_number VARCHAR(50) UNIQUE,
        role_id         INT DEFAULT 1,
        FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
      )
    `);
    console.log('Users table updated to reference roles');

    // Seed admin user (with updated credentials)
    const hashedPassword = await bcrypt.hash('BossPass!2', 10);
    await sqlQuery(
      `INSERT INTO users (
         username, email, password, phone_number, passport_number, role_id
       ) VALUES (?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE username = username, role_id = 1`,
      ['Admin', 'boss@flightcorp.com', hashedPassword, '9001122334', 'B123456', 1]
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

    // 2. Gates & Gate Assignments
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS gates (
        gate_id      INT AUTO_INCREMENT PRIMARY KEY,
        gate_number  VARCHAR(10),
        status       ENUM('Open','Closed','Maintenance') DEFAULT 'Open',
        UNIQUE(gate_number)
      )
    `);
    console.log('Gates table OK');

    // ─── Flight Routes ───────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS flight_routes (
        route_id          INT AUTO_INCREMENT PRIMARY KEY,
        departure_station INT NOT NULL,
        arrival_station   INT NOT NULL,
        FOREIGN KEY (departure_station) REFERENCES airports(airport_id) ON DELETE CASCADE,
        FOREIGN KEY (arrival_station) REFERENCES airports(airport_id) ON DELETE CASCADE
      )
    `);
    console.log('Flight Routes table OK');

    // Update flights table to reference flight_routes
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS flights (
        flight_id      INT AUTO_INCREMENT PRIMARY KEY,
        route_id       INT NOT NULL,
        departure_time DATETIME NOT NULL,
        arrival_time   DATETIME NOT NULL,
        gate_number    VARCHAR(50),
        airline_id     INT,
        price          INT,
        FOREIGN KEY (route_id) REFERENCES flight_routes(route_id) ON DELETE CASCADE,
        FOREIGN KEY (airline_id) REFERENCES airlines(airline_id) ON DELETE CASCADE,
        FOREIGN KEY (gate_number) REFERENCES gates(gate_number) ON DELETE SET NULL
      )
    `);
    console.log('Flights table updated to reference flight_routes');

    // Update services table
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS services (
        service_id   INT AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(100) NOT NULL,
        description  TEXT
      )
    `);
    console.log('Services table updated');

    // ─── Service Inventory ───────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS service_inventory (
        inventory_id     INT AUTO_INCREMENT PRIMARY KEY,
        service_id       INT NOT NULL,
        price            DECIMAL(8,2) NOT NULL,
        available_quantity INT NOT NULL DEFAULT 0,
        FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
      )
    `);
    console.log('Service Inventory table OK');


    // ─── Bookings ─────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS bookings (
        booking_id   INT AUTO_INCREMENT PRIMARY KEY,
        user_id      INT,
        flight_id    INT,
        total_price  INT,
        service_id   INT,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
          REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (flight_id)
          REFERENCES flights(flight_id) ON DELETE CASCADE,
        FOREIGN KEY (service_id)
          REFERENCES services(service_id) ON DELETE CASCADE
      )
    `);
    console.log('Bookings table OK');

    // ─── Payment Statuses and Methods ────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS payment_statuses (
        status_id INT AUTO_INCREMENT PRIMARY KEY,
        status_name ENUM('Pending', 'Completed', 'Failed', 'Refunded') NOT NULL
      )
    `);
    await sqlQuery(`
      INSERT INTO payment_statuses (status_name)
      VALUES ('Pending'), ('Completed'), ('Failed'), ('Refunded')
      ON DUPLICATE KEY UPDATE status_name = status_name
    `);
    console.log('Payment Statuses table OK');

    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        method_id INT AUTO_INCREMENT PRIMARY KEY,
        method_name ENUM('Card', 'UPI', 'Netbanking', 'Wallet') NOT NULL
      )
    `);
    await sqlQuery(`
      INSERT INTO payment_methods (method_name)
      VALUES ('Card'), ('UPI'), ('Netbanking'), ('Wallet')
      ON DUPLICATE KEY UPDATE method_name = method_name
    `);
    console.log('Payment Methods table OK');

    // Update payments table
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id      INT AUTO_INCREMENT PRIMARY KEY,
        booking_id      INT NOT NULL UNIQUE,
        user_id         INT NOT NULL,
        amount          DECIMAL(10,2) NOT NULL,
        status_id       INT,
        method_id       INT,
        transaction_ref VARCHAR(100),
        payment_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (status_id) REFERENCES payment_statuses(status_id) ON DELETE SET NULL,
        FOREIGN KEY (method_id) REFERENCES payment_methods(method_id) ON DELETE SET NULL
      )
    `);
    console.log('Payments table updated to reference statuses and methods');

    // ─── Notifications ────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id         INT         NOT NULL,
        message         TEXT        NOT NULL,
        is_read         BOOLEAN     DEFAULT FALSE,
        created_at      TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
          REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    console.log('Notifications table OK');

    // 3. Lounges & Access
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS lounges (
        lounge_id   INT AUTO_INCREMENT PRIMARY KEY,
        airport_id  INT NOT NULL,
        name        VARCHAR(100) NOT NULL,
        capacity    INT NOT NULL,
        FOREIGN KEY (airport_id)
          REFERENCES airports(airport_id) ON DELETE CASCADE
      )
    `);
    console.log('Lounges table OK');

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
    console.error(err.sqlMessage);
  }
};

export default initDb;
