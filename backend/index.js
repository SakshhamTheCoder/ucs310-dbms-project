import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import initDb from './utils/initDb.js';

import authRoutes from './routes/authRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import paymentsRoutes from './routes/paymentsRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import gateRoutes from './routes/gateRoutes.js';
import loungeRoutes from './routes/loungeRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

initDb().then(() => {
  app.get('/', (_req, res) => res.send('Hello World'));

  app.use('/api/auth', authRoutes);
  app.use('/api', flightRoutes);
  app.use('/api', servicesRoutes);
  app.use('/api', paymentsRoutes);
  app.use('/api', notificationsRoutes);
  app.use('/api', usersRoutes);

  app.use('/api', gateRoutes);
  app.use('/api', loungeRoutes);

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
});
