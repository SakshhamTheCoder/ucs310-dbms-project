import 'dotenv/config';
import express from 'express';
import sqlQuery from './utils/db.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {res.send('Hello World');});
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});