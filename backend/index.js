import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import sqlQuery from './utils/db.js';
import initDb from './utils/initDb.js';

import authRoutes from './routes/authRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import passengersRoutes from './routes/passengersRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import seatsRoutes from './routes/seatsRoutes.js';
import paymentsRoutes from './routes/paymentsRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

initDb()
  .then(() => {
    app.get('/', (_req, res) => res.send('Hello World'));

    app.use('/api/auth', authRoutes);
    app.use('/api', flightRoutes);
    app.use('/api', passengersRoutes);
    app.use('/api', servicesRoutes);
    app.use('/api', seatsRoutes);
    app.use('/api', paymentsRoutes);
    app.use('/api', notificationsRoutes);
    app.use('/api', usersRoutes);

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
