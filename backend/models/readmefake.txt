/api/flights - List all available flights.
/api/bookings - Book a flight, fetch user bookings, and delete a booking.
/api/auth/login - User login.
/api/auth/register - User registration.
/api/auth/me - Fetch logged-in user details.

1. INSERT INTO airports (airport_name, city) VALUES ('Delhi Airport', 'Delhi'), ('Mumbai Airport', 'Mumbai');
2. INSERT INTO airlines (airline_name) VALUES ('Air India'), ('IndiGo');
3. INSERT INTO flights (departure_time, arrival_time, departure_station, arrival_station, airline_id) VALUES
('2025-02-21 10:00:00', '2025-02-22 12:00:00', 1, 2, 1),
('2025-02-22 15:00:00', '2025-02-23 18:00:00', 2, 1, 2),
('2025-02-22 20:00:00', '2025-02-24 23:00:00', 1, 2, 1);
4. INSERT INTO users (username, email, password, phone_number, passport_number) VALUES
('Admin', 'admin@example.com', '$2b$10$mCw462XMsuc3kPc.cpje3uTZehBmGNwjIexpdtPDrlLh07dqt2djW', '1234567890', 'ABC123');
