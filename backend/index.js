import 'dotenv/config';
import express from 'express';
import sqlQuery from './utils/db.js';         // existing
import initDb from './utils/initDb.js';       // updated
import authRoutes from './routes/authRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import passengersRoutes from './routes/passengersRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({ origin: 'http://localhost:5173' })
);
app.use(express.json());

initDb()
  .then(() => {
    app.get('/', (_req, res) => {
      res.send('Hello World');
    });

    app.use('/api/auth', authRoutes);
    app.use('/api', flightRoutes);
    app.use('/api', passengersRoutes);
    app.use('/api', servicesRoutes);

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
