import { createConnection } from 'mysql2';

const con = createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

con.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

const sqlQuery = (sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

export default sqlQuery;

