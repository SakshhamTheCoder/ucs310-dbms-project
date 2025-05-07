import sqlQuery from '../utils/db.js';

export const listFlights = async (req, res) => {
    try {
        const flights = await sqlQuery(`
            SELECT flights.flight_id, flights.departure_time, flights.arrival_time, flights.price,
                   dep.airport_name AS departure_airport, arr.airport_name AS arrival_airport,
                   airlines.airline_name, gates.gate_number
            FROM flights
            JOIN flight_routes ON flights.route_id = flight_routes.route_id
            JOIN airports dep ON flight_routes.departure_station = dep.airport_id
            JOIN airports arr ON flight_routes.arrival_station = arr.airport_id
            JOIN airlines ON flights.airline_id = airlines.airline_id
            LEFT JOIN gates ON flights.gate_number = gates.gate_number
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
            SELECT bookings.booking_id, bookings.booking_date, bookings.total_price,
                   flights.flight_id, flights.departure_time, flights.arrival_time,
                   dep.airport_name AS departure_airport, arr.airport_name AS arrival_airport,
                   airlines.airline_name, gates.gate_number
            FROM bookings
            JOIN flights ON bookings.flight_id = flights.flight_id
            JOIN flight_routes ON flights.route_id = flight_routes.route_id
            JOIN airports dep ON flight_routes.departure_station = dep.airport_id
            JOIN airports arr ON flight_routes.arrival_station = arr.airport_id
            JOIN airlines ON flights.airline_id = airlines.airline_id
            LEFT JOIN gates ON flights.gate_number = gates.gate_number
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
        const fprice = await sqlQuery('SELECT price FROM flights WHERE flight_id = ?', [flightId]);
        if (existingBooking.length > 0) {
            return res.status(400).json({ message: 'You have already booked this flight' });
        }

        const result = await sqlQuery(
            `
            INSERT INTO bookings (user_id, flight_id,total_price) VALUES (?, ?, ?)
        `,
            [user_id, flightId, fprice[0]['price']]
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
    const { routeId, departureTime, arrivalTime, gateNumber, airlineId, price } = req.body;

    if (!routeId || !departureTime || !arrivalTime || !gateNumber || !airlineId || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await sqlQuery(
            'INSERT INTO gates (gate_number) VALUES (?) ON DUPLICATE KEY UPDATE gate_number = gate_number',
            [gateNumber]
        );
        const result = await sqlQuery(
            `
            INSERT INTO flights (route_id, departure_time, arrival_time, gate_number, airline_id, price)
            VALUES (?, ?, ?, ?, ?, ?)
        `,
            [routeId, departureTime, arrivalTime, gateNumber, airlineId, price]
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


export const getBookingsByUsername = async (req, res) => {
    const { username } = req.query;

    try {
        const bookings = await sqlQuery(`
        SELECT b.booking_id, f.flight_id, f.departure_time, f.arrival_time,
               dep.airport_name AS departure_airport, 
               arr.airport_name AS arrival_airport
        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        JOIN flights f ON b.flight_id = f.flight_id
        JOIN airports dep ON f.departure_station = dep.airport_id
        JOIN airports arr ON f.arrival_station = arr.airport_id
        WHERE u.username = ?
      `, [username]);

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new route
export const addRoute = async (req, res) => {
    const { departureStationName, arrivalStationName } = req.body;

    if (!departureStationName || !arrivalStationName) {
        return res.status(400).json({ message: 'Both departure and arrival station names are required' });
    }

    try {
        // Find the station IDs based on the names
        const departureStation = await sqlQuery(
            'SELECT airport_id FROM airports WHERE LOWER(airport_name) = LOWER(?)',
            [departureStationName]
        );

        const arrivalStation = await sqlQuery(
            'SELECT airport_id FROM airports WHERE LOWER(airport_name) = LOWER(?)',
            [arrivalStationName]
        );

        if (!departureStation.length) {
            return res.status(404).json({ message: `Departure station '${departureStationName}' not found` });
        }

        if (!arrivalStation.length) {
            return res.status(404).json({ message: `Arrival station '${arrivalStationName}' not found` });
        }

        const departureStationId = departureStation[0].airport_id;
        const arrivalStationId = arrivalStation[0].airport_id;

        if (departureStationId === arrivalStationId) {
            return res.status(400).json({ message: 'Departure and arrival stations cannot be the same' });
        }

        const result = await sqlQuery(
            `INSERT INTO flight_routes (departure_station, arrival_station)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE route_id = route_id`,
            [departureStationId, arrivalStationId]
        );

        res.status(201).json({ message: 'Route added successfully', route_id: result.insertId });
    } catch (err) {
        console.error('Error adding route:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
// Delete a route
export const deleteRoute = async (req, res) => {
    const { routeId } = req.params;

    if (!routeId) {
        return res.status(400).json({ message: 'Route ID is required' });
    }

    try {
        await sqlQuery('DELETE FROM flight_routes WHERE route_id = ?', [routeId]);
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// list all routes
export const listRoutes = async (req, res) => {
    try {
        const routes = await sqlQuery(`
            SELECT flight_routes.route_id, dep.airport_name AS departure_airport, arr.airport_name AS arrival_airport
            FROM flight_routes
            JOIN airports dep ON flight_routes.departure_station = dep.airport_id
            JOIN airports arr ON flight_routes.arrival_station = arr.airport_id
        `);
        res.json(routes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};