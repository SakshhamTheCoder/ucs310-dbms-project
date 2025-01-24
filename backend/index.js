import 'dotenv/config';
import e from 'express';
import sqlQuery from './utils/db.js';

const app = e();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

