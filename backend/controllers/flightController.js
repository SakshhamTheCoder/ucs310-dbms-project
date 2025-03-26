import sqlQuery from '../utils/db.js';

export const listFlights = async (req, res) => {
    try {
        const flights = await sqlQuery(`
            SELECT flights.flight_id, departure_time, arrival_time, terminal, 
                   dep.airport_name AS departure_airport, arr.airport_name AS arrival_airport, 
                   airlines.airline_name
            FROM flights
            JOIN airports dep ON flights.departure_station = dep.airport_id
            JOIN airports arr ON flights.arrival_station = arr.airport_id
            JOIN airlines ON flights.airline_id = airlines.airline_id
        `);
        console.log('Fetched Flights: ', flights);
        res.json(flights);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const fetchUserBookings = async (req, res) => {
    const user_id = req.user.id;

    try {
        const bookings = await sqlQuery(
            `
            SELECT bookings.booking_id, bookings.booking_date,
                   flights.flight_id, flights.departure_time, flights.arrival_time,
                   dep.airport_name AS departure_airport, arr.airport_name AS arrival_airport,
                   airlines.airline_name
            FROM bookings
            JOIN flights ON bookings.flight_id = flights.flight_id
            JOIN airports dep ON flights.departure_station = dep.airport_id
            JOIN airports arr ON flights.arrival_station = arr.airport_id
            JOIN airlines ON flights.airline_id = airlines.airline_id
            WHERE bookings.user_id = ?
        `,
            [user_id]
        );

        console.log('Fetched Bookings for User:', bookings);
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const bookFlight = async (req, res) => {
    const { flightId } = req.body;
    const user_id = req.user.id;

    console.log('Incoming Payload:', req.body);

    if (!flightId) {
        return res.status(400).json({ message: 'Flight ID is required' });
    }

    try {
        const existingBooking = await sqlQuery('SELECT * FROM bookings WHERE user_id = ? AND flight_id = ?', [
            user_id,
            flightId,
        ]);

        if (existingBooking.length > 0) {
            return res.status(400).json({ message: 'You have already booked this flight' });
        }

        const result = await sqlQuery(
            `
            INSERT INTO bookings (user_id, flight_id) VALUES (?, ?)
        `,
            [user_id, flightId]
        );

        res.status(201).json({ message: 'Booking successful', booking_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteBooking = async (req, res) => {
    const bookingId = req.params.id;
    const user_id = req.user.id;

    try {
        await sqlQuery('DELETE FROM bookings WHERE booking_id = ? AND user_id = ?', [bookingId, user_id]);
        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const listAirlines = async (req, res) => {
    try {
        const airlines = await sqlQuery('SELECT airline_id, airline_name FROM airlines');
        res.json(airlines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addAirline = async (req, res) => {
    const { airlineName } = req.body;

    if (!airlineName) {
        return res.status(400).json({ message: 'Airline name is required' });
    }

    try {
        const result = await sqlQuery('INSERT INTO airlines (airline_name) VALUES (?)', [airlineName]);
        res.status(201).json({ message: 'Airline added successfully', airline_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addFlight = async (req, res) => {
    const { departureStation, arrivalStation, airlineId, departureTime, arrivalTime, terminal } = req.body;

    if (!departureStation || !arrivalStation || !airlineId || !departureTime || !arrivalTime || !terminal) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await sqlQuery(
            `
            INSERT INTO flights (departure_station, arrival_station, airline_id, departure_time, arrival_time, terminal)
            VALUES (?, ?, ?, ?, ?, ?)
        `,
            [departureStation, arrivalStation, airlineId, departureTime, arrivalTime, terminal]
        );

        res.status(201).json({ message: 'Flight added successfully', flight_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const listAirports = async (req, res) => {
    try {
        const airports = await sqlQuery('SELECT airport_id, airport_name, city FROM airports');
        res.json(airports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addAirport = async (req, res) => {
    const { airportName, city } = req.body;

    if (!airportName || !city) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await sqlQuery('INSERT INTO airports (airport_name, city) VALUES (?, ?)', [airportName, city]);
        res.status(201).json({ message: 'Airport added successfully', airport_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

