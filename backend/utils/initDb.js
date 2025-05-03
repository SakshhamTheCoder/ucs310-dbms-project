// initDb.js — Merged Version (A + B)
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
        passport_number VARCHAR(50) UNIQUE,
        role            VARCHAR(10) DEFAULT 'user'
      )
    `);
    console.log('Users table OK');

    // ALTER to add role column if missing (graceful migration)
    try {
      await sqlQuery(`
        ALTER TABLE users
        ADD COLUMN role VARCHAR(10) DEFAULT 'user'
      `);
      console.log('Added role column to users table');

      // Update existing Admin user if role column was just added
      await sqlQuery(`
        UPDATE users
        SET role = 'admin'
        WHERE username = 'Admin'
      `);
      console.log('Updated Admin role');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('role column already exists in users table — skipping ALTER');
      } else {
        throw err;
      }
    }

    // Seed admin user (with updated credentials)
    const hashedPassword = await bcrypt.hash('BossPass!2', 10);
    await sqlQuery(
      `INSERT INTO users (
         username, email, password, phone_number, passport_number, role
       ) VALUES (?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE username = username, role = 'admin'`,
      ['Admin', 'boss@flightcorp.com', hashedPassword, '9001122334', 'B123456', 'admin']
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
    // Create with available_quantity in case of fresh install
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS services (
        service_id         INT AUTO_INCREMENT PRIMARY KEY,
        name               VARCHAR(100) NOT NULL,
        description        TEXT,
        price              DECIMAL(8,2) NOT NULL,
        available_quantity INT      NOT NULL DEFAULT 0,
        created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Services table OK');

    // ALTER to add available_quantity if missing (graceful migration)
    try {
      await sqlQuery(`
        ALTER TABLE services
        ADD COLUMN available_quantity INT NOT NULL DEFAULT 0
      `);
      console.log('Added available_quantity column to services');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('available_quantity column already exists — skipping ALTER');
      } else {
        throw err;
      }
    }

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

    // ─── Seats ─────────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS seats (
        seat_id       INT AUTO_INCREMENT PRIMARY KEY,
        flight_id     INT NOT NULL,
        seat_number   VARCHAR(10) NOT NULL,
        seat_class    ENUM('Economy','Business','First') NOT NULL,
        is_booked     BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (flight_id)
          REFERENCES flights(flight_id) ON DELETE CASCADE,
        UNIQUE(flight_id, seat_number)
      )
    `);
    console.log('Seats table OK');

    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS seat_reservations (
        reservation_id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id     INT NOT NULL,
        seat_id        INT NOT NULL,
        reserved_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id)
          REFERENCES bookings(booking_id) ON DELETE CASCADE,
        FOREIGN KEY (seat_id)
          REFERENCES seats(seat_id) ON DELETE CASCADE,
        UNIQUE(booking_id, seat_id)
      )
    `);
    console.log('Seat_Reservations table OK');

    // ─── Payments ──────────────────────────────────────────────────────────────
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id      INT AUTO_INCREMENT PRIMARY KEY,
        booking_id      INT NOT NULL UNIQUE,
        user_id         INT NOT NULL,
        amount          DECIMAL(10,2) NOT NULL,
        status          ENUM('Pending','Completed','Failed','Refunded') NOT NULL DEFAULT 'Pending',
        method          ENUM('Card','UPI','Netbanking','Wallet') NOT NULL,
        transaction_ref VARCHAR(100),
        payment_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id)
          REFERENCES bookings(booking_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id)
          REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    console.log('Payments table OK');

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

      // 1. Crew Members
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS crew_members (
        crew_id     INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        role        ENUM('Pilot','CoPilot','CabinCrew') NOT NULL,
        license_number  VARCHAR(50) UNIQUE,
        contact     VARCHAR(100),
        hired_date  DATE,
        status      ENUM('Active','OnLeave','Retired') DEFAULT 'Active',
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Crew_members table OK');

    // Add migration to rename license_no to license_number if needed
    try {
      await sqlQuery(`
        ALTER TABLE crew_members 
        CHANGE COLUMN license_no license_number VARCHAR(50) UNIQUE
      `);
      console.log('Renamed license_no to license_number if existed');
    } catch (err) {
      console.log('Column rename not needed or already done');
    }

    // Add contact column if it doesn't exist
    try {
      await sqlQuery(`
        ALTER TABLE crew_members
        ADD COLUMN contact VARCHAR(100)
      `);
      console.log('Added contact column to crew_members table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('contact column already exists in crew_members table — skipping ALTER');
      } else {
        console.log('Error adding contact column:', err.message);
      }
    }

    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS crew_assignments (
        assignment_id INT AUTO_INCREMENT PRIMARY KEY,
        flight_id     INT NOT NULL,
        crew_id       INT NOT NULL,
        assigned_role ENUM('Pilot','CoPilot','CabinCrew') NOT NULL,
        assigned_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
        FOREIGN KEY (crew_id)   REFERENCES crew_members(crew_id) ON DELETE CASCADE,
        UNIQUE(flight_id, crew_id, assigned_role)
      )
    `);
    console.log('Crew_assignments table OK');

    // 2. Gates & Gate Assignments
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS gates (
        gate_id      INT AUTO_INCREMENT PRIMARY KEY,
        terminal     VARCHAR(10) NOT NULL,
        gate_number  VARCHAR(10) NOT NULL,
        status       ENUM('Open','Closed','Maintenance') DEFAULT 'Open',
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(terminal, gate_number)
      )
    `);
    console.log('Gates table OK');

    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS gate_assignments (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        flight_id    INT NOT NULL,
        gate_id      INT NOT NULL,
        assigned_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
        FOREIGN KEY (gate_id)   REFERENCES gates(gate_id)     ON DELETE CASCADE,
        UNIQUE(flight_id)
      )
    `);
    console.log('Gate_assignments table OK');

    // 3. Lounges & Access
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS lounges (
        lounge_id   INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        location    VARCHAR(100) NOT NULL,
        capacity    INT NOT NULL,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Lounges table OK');

    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS lounge_access (
        access_id   INT AUTO_INCREMENT PRIMARY KEY,
        booking_id  INT NOT NULL,
        lounge_id   INT NOT NULL,
        access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
        FOREIGN KEY (lounge_id)  REFERENCES lounges(lounge_id)    ON DELETE CASCADE,
        UNIQUE(booking_id, lounge_id)
      )
    `);
    console.log('Lounge_access table OK');

    // 4. Feedback / Reviews
    await sqlQuery(`
      CREATE TABLE IF NOT EXISTS reviews (
        review_id    INT AUTO_INCREMENT PRIMARY KEY,
        passenger_id INT NOT NULL,
        flight_id    INT NOT NULL,
        rating       TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment      TEXT,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id) ON DELETE CASCADE,
        FOREIGN KEY (flight_id)    REFERENCES flights(flight_id)         ON DELETE CASCADE
      )
    `);
    console.log('Reviews table OK');

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
    console.error(err.sqlMessage);
  }
};

export default initDb;
