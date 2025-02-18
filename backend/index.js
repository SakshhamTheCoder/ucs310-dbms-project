import 'dotenv/config';
import express from 'express';
import sqlQuery from './utils/db.js';
import initDb from './utils/initDb.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Initialize database tables
initDb()
    .then(() => {
        // Routes setup
        app.get('/', (req, res) => {
            res.send('Hello World');
        });
        app.use('/api/auth', authRoutes);

        // Start server
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });

